"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  FaCheck,
  FaCreditCard,
  FaMobileAlt,
  FaUniversity,
  FaArrowLeft,
  FaLock,
  FaShieldAlt,
  FaSpinner,
  FaQrcode,
  FaCheckCircle,
} from "react-icons/fa";
import { getPricingInfo, isIndia } from "../lib/pricing";
import { getSupabaseBrowserClient } from "../lib/supabaseClient";
import { isAdminEmail } from "../lib/admin";

const planStorageKey = "pmp-simulator-plan-v1";
const userStorageKey = "pmp-simulator-user-v1";

type PaymentMethod = "upi" | "credit-card" | "debit-card";

type UserProfile = {
  name?: string;
  email?: string;
};

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "annual";

  const [userInIndia, setUserInIndia] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  // UPI fields
  const [upiId, setUpiId] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Payment state
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  const founderAvailable = false; // We'll check signup count later, but for checkout this is fine
  const pricing = getPricingInfo(
    plan === "founder",
    userInIndia,
  );

  const planLabel =
    plan === "founder"
      ? "Founder Plan"
      : plan === "annual"
        ? "Annual Plan"
        : "Global Plan";

  const planAmount = getPricingInfo(plan === "founder", userInIndia);

  // Check user session and admin status on mount
  useEffect(() => {
    const raw = window.localStorage.getItem(userStorageKey);
    let currentUser: UserProfile | null = null;
    if (raw) {
      try {
        currentUser = JSON.parse(raw) as UserProfile;
        setUser(currentUser);
      } catch {
        /* ignore */
      }
    }

    setUserInIndia(isIndia());
    setLoading(false);

    // Admin auto-grant: if admin, skip payment
    if (currentUser?.email && isAdminEmail(currentUser.email)) {
      // Record purchase first, then show success
      const performAdminGrant = async () => {
        await recordPurchase(plan, currentUser.email);
        setPaid(true);
        setRedirectCountdown(3);
      };
      performAdminGrant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  // Redirect countdown after successful payment
  useEffect(() => {
    if (!paid || redirectCountdown <= 0) return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.localStorage.setItem(planStorageKey, plan);
          window.localStorage.removeItem("pmp-simulator-progress-v1");
          router.push("/payment/success?plan=" + encodeURIComponent(plan));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paid, redirectCountdown, plan, router]);



  const recordPurchase = async (purchasedPlan: string, userEmail?: string) => {
    const supabase = getSupabaseBrowserClient();
    let userId: string | null = null;
    let email: string | null = userEmail ?? null;

    if (supabase) {
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id ?? null;
      if (!email) {
        email = data?.user?.email ?? null;
      }
    }

    await fetch("/api/submit-purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: purchasedPlan,
        userId,
        email,
      }),
    });
  };

  const handleUPIPayment = async () => {
    if (!upiId.trim()) {
      setError("Please enter your UPI ID");
      return;
    }
    if (!upiId.includes("@")) {
      setError("Enter a valid UPI ID (e.g., name@upi)");
      return;
    }

    setError("");
    setProcessing(true);

    // Simulate UPI payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProcessing(false);
    setPaid(true);
    await recordPurchase(plan, user?.email);
    setRedirectCountdown(3);
  };

  const handleCardPayment = async () => {
    if (!cardName.trim()) {
      setError("Enter cardholder name");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setError("Enter a valid 16-digit card number");
      return;
    }
    if (expiry.replace("/", "").length < 4) {
      setError("Enter a valid expiry date (MM/YY)");
      return;
    }
    if (cardCvv.length < 3) {
      setError("Enter a valid CVV");
      return;
    }

    setError("");
    setProcessing(true);

    // Simulate card payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    setProcessing(false);
    setPaid(true);
    await recordPurchase(plan, user?.email);
    setRedirectCountdown(3);
  };

  const handlePay = () => {
    if (paymentMethod === "upi") {
      void handleUPIPayment();
    } else {
      void handleCardPayment();
    }
  };

  // Format card number with spaces
  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) {
      setExpiry(digits.slice(0, 2) + "/" + digits.slice(2));
    } else {
      setExpiry(digits);
    }
  };

  // Cvv only digits, max 4
  const handleCvvChange = (value: string) => {
    setCardCvv(value.replace(/\D/g, "").slice(0, 4));
  };

  if (loading) {
    return (
      <main className="checkout-page">
        <section className="checkout-shell">
          <div className="checkout-spinner">
            <div className="exam-spinner" />
            <p>Loading checkout...</p>
          </div>
        </section>
      </main>
    );
  }

  // Admin auto-granted — show countdown
  if (paid && user?.email && isAdminEmail(user.email)) {
    return (
      <main className="checkout-page">
        <section className="checkout-shell">
          <div className="checkout-success">
            <FaCheckCircle className="checkout-success-icon" />
            <h1>Welcome, Admin!</h1>
            <p>
              Admin access auto-granted. Redirecting to confirmation in{" "}
              {redirectCountdown}s...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Payment complete
  if (paid) {
    return (
      <main className="checkout-page">
        <section className="checkout-shell">
          <div className="checkout-success">
            <FaCheckCircle className="checkout-success-icon" />
            <h1>Payment Successful!</h1>
            <p>
              Your {planLabel} is now active. Redirecting in{" "}
              {redirectCountdown}s...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Detect card scheme from first digits
  const cardScheme =
    cardNumber.startsWith("4")
      ? "Visa"
      : cardNumber.startsWith("5")
        ? "Mastercard"
        : cardNumber.startsWith("3")
          ? "Amex"
          : "";

  return (
    <main className="checkout-page">
      <section className="checkout-shell">
        {/* Header */}
        <div className="checkout-nav">
          <Link href="/pricing" className="learn-back-link">
            <FaArrowLeft aria-hidden="true" /> Back to pricing
          </Link>
        </div>

        <div className="checkout-layout">
          {/* Left: Payment form */}
          <div className="checkout-form-area">
            <p className="intro-eyebrow">Checkout</p>
            <h1>Complete your purchase</h1>

            {/* Payment method tabs */}
            <div className="checkout-methods">
              <button
                type="button"
                className={`checkout-method-tab ${paymentMethod === "upi" ? "checkout-method-active" : ""}`}
                onClick={() => {
                  setPaymentMethod("upi");
                  setError("");
                }}
              >
                <FaMobileAlt />
                <span>UPI</span>
              </button>
              <button
                type="button"
                className={`checkout-method-tab ${paymentMethod === "credit-card" ? "checkout-method-active" : ""}`}
                onClick={() => {
                  setPaymentMethod("credit-card");
                  setError("");
                }}
              >
                <FaCreditCard />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                className={`checkout-method-tab ${paymentMethod === "debit-card" ? "checkout-method-active" : ""}`}
                onClick={() => {
                  setPaymentMethod("debit-card");
                  setError("");
                }}
              >
                <FaUniversity />
                <span>Debit Card</span>
              </button>
            </div>

            {/* UPI form */}
            {paymentMethod === "upi" && (
              <div className="checkout-form">
                <div className="checkout-upi-qr">
                  <FaQrcode className="checkout-qr-icon" />
                  <p>Scan with any UPI app</p>
                  <div className="checkout-qr-placeholder" />
                  <p className="checkout-upi-or">— or enter UPI ID —</p>
                </div>

                <div className="checkout-field">
                  <label htmlFor="upi-id">UPI ID</label>
                  <input
                    id="upi-id"
                    type="text"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      setError("");
                    }}
                    placeholder="name@upi"
                    disabled={processing}
                  />
                </div>

                <div className="checkout-upi-apps">
                  <span>Popular UPI apps</span>
                  <div className="checkout-upi-badges">
                    <span>Google Pay</span>
                    <span>PhonePe</span>
                    <span>Paytm</span>
                    <span>BHIM</span>
                    <span>Amazon Pay</span>
                  </div>
                </div>
              </div>
            )}

            {/* Credit/Debit Card form */}
            {(paymentMethod === "credit-card" || paymentMethod === "debit-card") && (
              <div className="checkout-form">
                <div className="checkout-card-preview">
                  <div className="checkout-card-art">
                    <div className="checkout-card-chip" />
                    <p className="checkout-card-number">
                      {cardNumber || "•••• •••• •••• ••••"}
                    </p>
                    <div className="checkout-card-footer">
                      <div>
                        <span>Cardholder</span>
                        <strong>{cardName || "Your Name"}</strong>
                      </div>
                      <div>
                        <span>Expires</span>
                        <strong>{expiry || "MM/YY"}</strong>
                      </div>
                      {cardScheme && (
                        <div className="checkout-card-scheme">{cardScheme}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="checkout-field">
                  <label htmlFor="card-name">Cardholder Name</label>
                  <input
                    id="card-name"
                    type="text"
                    value={cardName}
                    onChange={(e) => {
                      setCardName(e.target.value);
                      setError("");
                    }}
                    placeholder="John Doe"
                    disabled={processing}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="card-number">Card Number</label>
                  <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => {
                      handleCardNumberChange(e.target.value);
                      setError("");
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    disabled={processing}
                  />
                </div>

                <div className="checkout-row">
                  <div className="checkout-field">
                    <label htmlFor="card-expiry">Expiry (MM/YY)</label>
                    <input
                      id="card-expiry"
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => {
                        handleExpiryChange(e.target.value);
                        setError("");
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      disabled={processing}
                    />
                  </div>
                  <div className="checkout-field">
                    <label htmlFor="card-cvv">CVV</label>
                    <input
                      id="card-cvv"
                      type="text"
                      inputMode="numeric"
                      value={cardCvv}
                      onChange={(e) => {
                        handleCvvChange(e.target.value);
                        setError("");
                      }}
                      placeholder="123"
                      maxLength={4}
                      disabled={processing}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <div className="checkout-error">{error}</div>}

            <button
              type="button"
              className="intro-primary-action checkout-pay-btn"
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? (
                <>
                  <FaSpinner className="checkout-spinner-icon" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                <>
                  <FaLock aria-hidden="true" />
                  Pay {planAmount.label} securely
                </>
              )}
            </button>

            <p className="checkout-secure-note">
              <FaShieldAlt aria-hidden="true" />
              This is a simulated payment for demo purposes. No real money
              will be charged.
            </p>
          </div>

          {/* Right: Order summary */}
          <div className="checkout-summary">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Plan</span>
                <span className="checkout-summary-value">{planLabel}</span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Amount</span>
                <span className="checkout-summary-value checkout-summary-amount">
                  {planAmount.label}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Duration</span>
                <span className="checkout-summary-value">1 year</span>
              </div>
              <div className="checkout-summary-divider" />
              <div className="checkout-summary-row">
                <span className="checkout-summary-label">Total</span>
                <span className="checkout-summary-value checkout-summary-total">
                  {planAmount.label}
                </span>
              </div>
            </div>

            <div className="checkout-benefits-card">
              <p className="checkout-benefits-title">What you get:</p>
              <ul className="checkout-benefits-list">
                <li>
                  <FaCheck /> Live AI-generated PMP questions
                </li>
                <li>
                  <FaCheck /> All learning topics unlocked
                </li>
                <li>
                  <FaCheck /> Full 185-question exam simulation
                </li>
                <li>
                  <FaCheck /> 1-year full access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="checkout-page">
          <section className="checkout-shell">
            <div className="checkout-spinner">
              <div className="exam-spinner" />
              <p>Loading checkout...</p>
            </div>
          </section>
        </main>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
