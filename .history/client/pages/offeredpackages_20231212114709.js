import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { toast } from "react-toastify";
import {loadStripe} from "@stripe/stripe-js";
import { useRouter } from "next/router";
const styles = {
  packagesContainer: {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
    color: "white",
    height: "auto",
  },
  packagesList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
  },
  packageCard: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "20px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  selectButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  reviewButton: {
    marginTop: "10px",
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  searchContainer: {
    textAlign: "center", // Center-align the search box
    backgroundColor: "black",
    padding: "20px 0",
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    maxWidth: "600px", // Make it wider
    padding: "15px", // Increase padding for larger size
    fontSize: "18px", // Increase font size for larger size
    border: "none",
    borderRadius: "5px",
    outline: "none",
    margin: "0 auto",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
};
// ... (import statements and other styles) ...

export default function offeredpackages() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolled, setEnrolled] = useState();
  useEffect(() => {
    AOS.init();
    loadPackages();
  }, []);

  // In your React component for editing a package
  const handleReview = (pkg) => {
    const { _id: packageId } = pkg; // Get the packageId from pkg
    router.push(`/showReview?packageId=${packageId}`);
  };
  const loadPackages = async () => {
    const { data } = await axios.get("/api/allpackages");
    setPackages(data);
    console.log(data);
  };

  const handlePaid = async (pkg) => {
    try {
      const { _id: packageId } = pkg;
  
      // Send a request to check if the user is already enrolled
      const { data } = await axios.get(`/api/check-enrollment/${packageId}`);
  
      if (data) {
        // The user is already enrolled
        toast.error("You have already purchased this package.");
      } else {
        // The user is not enrolled, proceed with the payment
        const { data: sessionData } = await axios.post(`/api/paid-enrollment/${packageId}`);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
        stripe.redirectToCheckout({ sessionId: sessionData });
      }
    } catch (err) {
      toast.error("Enrollment Failed. Try again.");
      console.error(err);
    }
  };
  
  
  // Filter packages based on the search query
  const filteredPackages = packages.filter((pkg) =>
    pkg.place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="site1">
      <section>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search Packages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.packagesContainer}>
          <div style={styles.packagesList}>
            {filteredPackages.map((pkg) => (
              <div key={pkg._id} style={styles.packageCard}>

<img
                  src={`data:${pkg.image.contentType};base64,${Buffer.from(pkg.image.data).toString('base64')}`}
                  alt={pkg.place}
                />

                <h2>{pkg.place}</h2>
                <p>
                  <strong>Price:</strong> {pkg.price}
                </p>
                <p>
                  <strong>Days:</strong> {pkg.days}
                </p>
                <p>{pkg.description}</p>
                <button style={styles.selectButton}
                 onClick={() => handlePaid(pkg)}
                >Buy</button>
                <button
                  style={styles.reviewButton}
                  onClick={() => handleReview(pkg)} // Wrap in anonymous function
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

