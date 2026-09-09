"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Cloud,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";

import styles from "./login-screen.module.css";

const trustItems = [
  { label: "Secure", icon: ShieldCheck },
  { label: "Reliable", icon: Cloud },
  { label: "User Friendly", icon: UserRoundCheck },
];

export function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    router.push("/dashboard");
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="Jewellery ERP overview">
        <Image
          alt=""
          className={styles.heroImage}
          fill
          priority
          sizes="(max-width: 820px) 100vw, 50vw"
          src="/images/jewellery-login-hero.png"
        />
        <div className={styles.heroShade} />

        <div className={styles.heroContent}>
          <div className={styles.heroBrand}>
            <BrandMark className={styles.heroBrandMark} size={54} />
            <strong>Jewellery ERP</strong>
            <span>Manage Today, Shine Tomorrow</span>
          </div>

          <div className={styles.heroCopy}>
            <p>Complete Jewellery Business Management</p>
            <span>
              From Sales to Stock, Karigar to Accounting
              <br />
              Everything in One Place
            </span>
          </div>

          <div className={styles.trustBar} aria-label="Product qualities">
            {trustItems.map(({ label, icon: Icon }) => (
              <div className={styles.trustItem} key={label}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.authPanel} aria-labelledby="login-title">
        <div className={styles.authContent}>
          <BrandMark className={styles.authBrandMark} size={72} />

          <div className={styles.loginCard}>
            <div className={styles.cardHeading}>
              <h1 id="login-title">Welcome Back</h1>
              <p>Login to your Jewellery ERP account</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formField}>
                <label htmlFor="username">Username</label>
                <div className={styles.inputWrap}>
                  <UserRound aria-hidden="true" />
                  <input
                    autoComplete="username"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrap}>
                  <LockKeyhole aria-hidden="true" />
                  <input
                    autoComplete="current-password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.remember}>
                  <input name="remember" type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link href="#forgot-password">Forgot password</Link>
              </div>

              <button className={styles.loginButton} disabled={isSubmitting} type="submit">
                <LogIn aria-hidden="true" />
                {isSubmitting ? "Signing in..." : "Login"}
              </button>

              <div className={styles.divider} aria-hidden="true">
                <span />
                <b>OR</b>
                <span />
              </div>

              <button
                className={styles.googleButton}
                onClick={() => router.push("/dashboard")}
                type="button"
              >
                <span className={styles.googleMark} aria-hidden="true">
                  G
                </span>
                Login with Google
              </button>
            </form>
          </div>

          <p className={styles.contact} id="forgot-password">
            Don&apos;t have an account?{" "}
            <a href="mailto:admin@jewelleryerp.local">Contact Administrator</a>
          </p>
        </div>
      </section>
    </main>
  );
}
