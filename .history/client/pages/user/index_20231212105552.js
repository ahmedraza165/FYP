import { useState, useContext, useEffect } from "react";
import { Context } from "../../context";
import toast from 'react-toastify';
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';
import UserRoute from "../../components/routes/UserRoute";
import { Avatar, Card, Row, Col, Space } from "antd";
import Link from "next/link";
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
};

import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons"
const UserIndex = () => {
  const router = useRouter();

  const {
    state: { user },
  } = useContext(Context);
  const [completionData, setCompletionData] = useState({});
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    AOS.init();
    loadCourses();
  }, []);
  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user-packages');
      setPackages(data);
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
    // In your React component for editing a package
    const handleReview = (pkg) => {
      const { _id: packageId } = pkg; // Get the packageId from pkg
      router.push(`/review?packageId=${packageId}`);
    };
  return (
    <>
      <UserRoute>
        <div className="site1">
          <div className="jumbotron">
            <h1 className="jumbotron1 text-center text-white"  data-aos='fade-left'
                        data-aos-duration='1500'>User Dashboard</h1>
                   <section>
            <div style={styles.packagesContainer}>
              <div style={styles.packagesList}>
                {packages.map((pkg) => (
                  <div key={pkg._id} style={styles.packageCard}>
                    <h2>{pkg.place}</h2>
                    <p>
                      <strong>Price:</strong> {pkg.price}
                    </p>
                    <p>
                      <strong>Days:</strong> {pkg.days}
                    </p>
                    <p>{pkg.description}</p>
                    <button
                      style={styles.reviewButton}
                      onClick={() => handleReview(pkg)} 
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
      </UserRoute>
    </>
  );
};

export default UserIndex;
