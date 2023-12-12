import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import Rating from "react-rating-stars-component";
import {loadStripe} from "@stripe/stripe-js";
import Modal from "react-modal";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh", // Set minimum height to push footer to the bottom
    position: "relative", // For footer positioning
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
  reviewHeader: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#4CAF50",
  },
  detailsContainer: {
    width: "60%",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
    backgroundColor: "#383e46",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  detail: {
    fontSize: "1.1rem",
    margin: "10px 0",
  },
  feedbackForm: {
    marginTop: "20px",
    width: "80%", // Adjusted width
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  feedbackInput: {
    width: "100%", // Adjusted width
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    color: "black",
  },
  feedbackSelect: {
    width: "100%", // Adjusted width
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    color: "black",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%", // Adjusted width
  },
  feedbackContainer: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  feedbackItem: {
    width: "100%", // Adjusted width
    backgroundColor: "#007BFF",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "10px",
  },
  feedbackRating: {
    fontSize: "1.2rem",
    color: "white",
  },
  feedbackText: {
    fontSize: "1rem",
    color: "white",
  },
  footer: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    backgroundColor: "black",
    color: "white",
    padding: "10px",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    marginTop: "10px",
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

  // Adjust styles for the buttons
  selectButton: {
    flex: "1", // Make the button take up equal space
    marginRight: "5px", // Add some space between buttons
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  chatButton: {
    flex: "1", // Make the button take up equal space
    marginLeft: "5px", // Add some space between buttons
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "200px"
  },
};

const NewReviewPage = () => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5); // Default rating
  const [formData, setFormData] = useState({
    place: "",
    days: "",
    price: "",
    description: "",
  });
  const data = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;
  const { packageId } = router.query; // Get the packageId from query parameters

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (packageId) {
      // Fetch package details using packageId
      axios
        .get(`/api/packages/${packageId}`)
        .then((response) => {
          const { place, days, price, description } = response.data;
          setFormData({ place, days, price, description });
        })
        .catch((error) => {
          console.error("Error fetching package details", error);
        });

      axios
        .get(`/api/packages/${packageId}/feedback`)
        .then((response) => {
          setFeedbackList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching feedback:", error);
        });
    }
  }, [packageId]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
    setChatMessage(''); // Reset chat message when closing the modal
  };

  const handleChatNow = async () => {
    try {
      openChatModal();
      const response = await axios.get(`/api/chat`, {
        params: {
          userId: data,
          packageId: packageId
        }
      });
      console.log('Raw Response Data:', response.data); // Log the raw data
  
      const parsedData = JSON.parse(response.data);
      console.log('Parsed Data:', parsedData);
  
     
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };
  const handleSendMessage = async () => {
    try {
      // Make sure there is a chat message to send
      if (!chatMessage.trim()) {
        return;
      }
  
      // Send the chat message to the server
      const response = await axios.post('/api/addChat', {
        userID: data,         // Assuming data contains the user ID
        packageId: packageId, // Assuming packageId is defined in your component
        message: chatMessage,
      });
  
      console.log('Chat API Response:', response.data);
  
      // Clear the input field after sending the message
      setChatMessage('');
  
      // You may want to handle the response from the server here if needed
      // For example, show a success message or handle errors
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle the error, show a toast, or any other error handling logic
    }
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.reviewHeader}>Review and Feedback</h1>
      <div style={styles.detailsContainer}>
        <h2 style={styles.title}>{formData.place}</h2>
        <p style={styles.detail}>
          <strong>Price:</strong> {formData.price}
        </p>
        <p style={styles.detail}>
          <strong>Duration:</strong> {formData.days}
        </p>
        <p style={styles.detail}>{formData.description}</p>
        <div style={styles.buttonContainer}>
          {/* <button style={styles.selectButton} onClick={() => handlePaid(formData.packageId)}>
            Buy
          </button> */}
          <button style={styles.chatButton} onClick={() => handleChatNow(formData)}>
            Chat Now
          </button>
        </div>
      </div>

      <div style={styles.feedbackContainer}>
        <h2>Feedback for This Package</h2>
        {feedbackList.map((feedback) => (
          <div style={styles.feedbackItem} key={feedback._id}>
            <Rating value={feedback.rating} edit={false} isHalf={true} size={24} color="#4CAF50" />
            {feedback ? <p style={styles.feedbackText}>{feedback.feedback}</p> : <p>No feedback given</p>}
          </div>
        ))}
      </div>

  {/* Chat Modal */}
  <Modal
        isOpen={isChatModalOpen}
        onRequestClose={closeChatModal}
        style={{ ...styles.modal, content: { ...styles.modal.content, display: 'flex', flexDirection: 'column' } }}
        contentLabel="Chat Modal"
      >
        {/* Close button in the top right corner */}
        <button style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={closeChatModal}>
          <span style={{ fontSize: '24px', color: '#000' }}>✖</span>
        </button>

        {/* Chat input field */}
        <div style={{ marginTop: '480px', flex: 1 }}>
        <input
        type="text"
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
        style={{ width: '100%', padding: '10px' }}
        placeholder="Type your message..."
        />
        </div>

        {/* Enter button */}
        <button
          style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          onClick={handleSendMessage}
        >
          Send
        </button>
      </Modal>
    </div>
  );
};

export default NewReviewPage;