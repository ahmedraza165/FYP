import { useState, useEffect } from "react";
import axios from "axios";
import AgencyRoute from "../../components/routes/AgencyRoute";
import { Avatar, Tooltip } from "antd";
import { Card } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Modal from "react-modal";

const styles = {
  packagesContainer: {
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
    color: "white",
    height: "auto",
  },
  chatButton: {
    flex: "1", // Make the button take up equal space
    marginLeft: "5px", // Add some space between buttons
    padding: "10px 20px",
    marginTop: "5px",
    backgroundColor: "#FCA311",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "200px",
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
  modal: {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      width: "600px", // Set the width of the modal
      margin: "auto",
      borderRadius: "10px",
      padding: "20px",
      backgroundColor: "#fff",
    },
  },
};

const Index = () => {
  const router = useRouter();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    AOS.init();
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    setPackages(data);
  };
  // In your React component for editing a package
  const handleEdit = async (pkg) => {
    const { _id: packageId } = pkg; // Get the packageId from pkg
    router.push(`/updatenewpackage?packageId=${packageId}`);
  };
  const handleDelete = async (pkg) => {
    try {
      // Send a DELETE request to delete the package
      await axios.delete(`/api/packages/${pkg._id}`);

      // Show success toast
      toast.success("Package Deleted");

      // Remove the deleted package from the state
      setPackages((prevPackages) =>
        prevPackages.filter((p) => p._id !== pkg._id)
      );
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  };

  const myStyle = { marginTop: "-15px", fontSize: "10px" };

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
    setChatMessage(""); // Reset chat message when closing the modal
  };

  const handleChatNow = (packageId) => {
    // Add your chat logic here
    // ...
    openChatModal();
  };

  const handleSendMessage = () => {
    // Add your logic to send the chat message
    // For example, you might want to use a chat API or store messages in a state
    console.log("Sending message:", chatMessage);

    // Clear the input field after sending the message
    setChatMessage("");
  };
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  return (
    <AgencyRoute>
      <div className="site1">
        <div className="jumbotron">
          <h1
            className="jumbotron1 text-center text-white"
            data-aos="fade-left"
            data-aos-duration="1500"
          >
            Agency Packages
          </h1>
          <section>
            <div style={styles.packagesContainer}>
              <div style={styles.packagesList}>
                {packages.map((pkg) => (
                  <div key={pkg._id} style={styles.packageCard}>
                    <img
                      src={`data:${pkg.image.contentType};base64,${Buffer.from(
                        pkg.image.data
                      ).toString("base64")}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "300px",
                        maxHeight: "200px",
                      }}
                    />
                    <h2>{pkg.place}</h2>
                    <p>
                      <strong>Price:</strong> {pkg.price}
                    </p>
                    <p>
                      <strong>Days:</strong> {pkg.days}
                    </p>
                    <p>{pkg.description}</p>
                    <button
                      style={styles.selectButton}
                      onClick={() => handleEdit(pkg)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.reviewButton}
                      onClick={() => handleDelete(pkg)}
                    >
                      Delete
                    </button>
                    <button
                      style={styles.chatButton}
                      onClick={() => handleChatNow(pkg.packageId)}
                    >
                      Chat Now
                    </button>
                    {/* Chat Modal */}
                    <Modal
                      isOpen={isChatModalOpen}
                      onRequestClose={closeChatModal}
                      style={{
                        ...styles.modal,
                        content: {
                          ...styles.modal.content,
                          display: "flex",
                          flexDirection: "column",
                        },
                      }}
                      contentLabel="Chat Modal"
                    >
                      {/* Close button in the top right corner */}
                      <button
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          cursor: "pointer",
                        }}
                        onClick={closeChatModal}
                      >
                        <span style={{ fontSize: "24px", color: "#000" }}>
                          ✖
                        </span>
                      </button>

                      {/* Chat input field */}
                      <div style={{ marginTop: "530px", flex: 1 }}>
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          style={{ width: "100%", padding: "10px" }}
                          placeholder="Type your message..."
                        />
                      </div>

                      {/* Enter button */}
                      <button
                        style={{
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "#007BFF",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={handleSendMessage}
                      >
                        Send
                      </button>
                    </Modal>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AgencyRoute>
  );
};

export default Index;
