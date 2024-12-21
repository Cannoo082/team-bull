import Link from "next/link";

// TODO 
export default function ResetPasswordPage() {
  return (
    <>
      <h1>Reset Password</h1>
      <Link href="/login" style={{fontSize: "2rem"}}>Back</Link>
    </>
  );
}
