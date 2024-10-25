'use client';
import { useUser } from "@clerk/nextjs";
export default function SuccessPage() {
const { isLoaded, isSignedIn, user } = useUser();
  return (
    <div className='w-full h-screen flex items-center justify-center flex-col gap-3 text-center'>
      <h1>✅ Paiement réussi!</h1>
        <div>
          <p>error in reservation, {user?.fullName}!</p>
          <ul>
            <li>Email: {user?.emailAddresses[0].toString()}</li>
          </ul>
        </div>
        <p>try another time</p>
    </div>
  );
}