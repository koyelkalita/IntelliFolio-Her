// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { db } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import ModernTemplate from "@/components/templates/ModernTemplate";

// /* PublicPortfolioPage handles the dynamic rendering of user websites.*/

// export default function PublicPortfolioPage() {
//   const { username } = useParams();
//   const [portfolioData, setPortfolioData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);

//   useEffect(() => {
//     /**
//      * Fetches user-specific portfolio data from the 'portfolios' collection.
//      * The document ID must match the 'username' slug generated in the dashboard.
//      */
//     async function fetchPortfolio() {
//       if (!username) return;

//       try {
//         setIsLoading(true);
//         const docRef = doc(db, "portfolios", username);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setPortfolioData(docSnap.data());
//         } else {
//           setHasError(true);
//         }
//       } catch (error) {
//         console.error("Error retrieving portfolio data:", error);
//         setHasError(true);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchPortfolio();
//   }, [username]);

//   // Loading state provides feedback while the Firestore query completes
//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-white">
//         <div className="animate-pulse text-gray-400 font-medium">
//           Loading Portfolio...
//         </div>
//       </div>
//     );
//   }

//   // Error state handles missing documents or database connection issues
//   if (hasError || !portfolioData) {
//     return (
//       <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">
//           404 - Portfolio Not Found
//         </h1>
//         <p className="mt-2 text-gray-500">
//           The requested URL does not exist or hasn't been published yet.
//         </p>
//       </div>
//     );
//   }

//   // Final render passes the fetched JSON to the UI template component
//   return <ModernTemplate portfolio={portfolioData} />;
// }

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ModernTemplate from "@/components/templates/ModernTemplate";

export default function PublicPortfolioPage() {
  const { username } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      if (!username) return;
      try {
        // Look for a document in the 'portfolios' collection
        const docRef = doc(db, "portfolios", username);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPortfolioData(docSnap.data());
        }
      } catch (error) {
        console.error("Database fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, [username]);

  if (loading)
    return (
      <div className="p-20 text-center font-mono">Fetching AI Data...</div>
    );
  if (!portfolioData)
    return (
      <div className="p-20 text-center">
        Portfolio not found. Did you click 'Generate' in the dashboard?
      </div>
    );

  // Render the template with the REAL data from the database
  return <ModernTemplate portfolio={portfolioData} />;
}