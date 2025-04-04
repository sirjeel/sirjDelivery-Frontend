
import { initializeApp  } from "firebase/app";
import { collection, getFirestore, query, orderBy, limit, getDocs, where  } from "firebase/firestore";
import { firebaseConfig } from "../config";
import {flattenStops} from "../helper"



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



export const getMostRecentRouteAndFilteredStops = async () => {
  const routesRef = collection(db, "route");
  const q = query(
      routesRef,
      orderBy("createdAt", "desc"), // Replace "createdAt" with your timestamp field
      limit(1)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
      console.log("No routes found.");
      return null;
  }

  // Get the most recent route document
  const mostRecentRouteDoc = querySnapshot.docs[0];
  const routeData = mostRecentRouteDoc.data();

  // Assuming `stops` is a property within the `routeData`
  if (routeData && routeData.stops && Array.isArray(routeData.stops)) {
      // Sort the stops array by the 'time' property in descending order
      const sortedStops = routeData.stops.sort((a: any, b: any) => {
          return new Date(b.time).getTime() - new Date(a.time).getTime();
      }).slice(0, 50); // Limit to 20 items

      return {sortedStops};
  } else {
      console.log("No stops found in the most recent route.");
      return {
          stops: []
      };
  }
}




export const getRoutesBetweenDates = async (startDate: string, endDate: string) => {
  try {
    const routesCollection = collection(db, 'route');
/*
    // Convert dates to Firestore Timestamps
    const startTimestamp = Timestamp.fromDate(new Date(startDate));
    const endTimestamp = Timestamp.fromDate(new Date(endDate));

    // Extract seconds
    const startSeconds = startTimestamp.seconds;
    const endSeconds = endTimestamp.seconds;
*/
    // Query based on the 'seconds' value within the string
    const q = query(routesCollection,
      where('createdAt', '>=', `Timestamp(seconds=${startDate}`), // Start of the timestamp
      where('createdAt', '<=', `Timestamp(seconds=${endDate}`) // End of the timestamp
    );

    const querySnapshot = await getDocs(q);
    const routes = [];
    querySnapshot.forEach((doc) => {
      routes.push({ ...doc.data() });
    });
const flattenedStops = flattenStops(routes);
    return routes;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return error;
  }
};

  


/*

// below function search query string between dates cuttoff
export const getRoutesBetweenDates = async (
  startDate: Date,
  endDate: Date,
  searchQuery: string | null
): Promise<Route[]> => {
  try {
    const routesCollection = collection(db, 'route');
    let q = query(
      routesCollection,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );

    const querySnapshot = await getDocs(q);
    const routes = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const stops: Stop[] = data.stops || [];

      const filteredStops = stops.filter((stop) => {
        if (!searchQuery) return true;
        return stop.description?.toLowerCase().includes(searchQuery.toLowerCase());
      });

      if (filteredStops.length > 0) {
        routes.push({
          id: doc.id,
          ...data,
          stops: filteredStops,
        } as Route);
      }
    });

    return routes;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error; // Or return an empty array, depending on your error handling strategy
  }
};
*/




/*
// Example usage:
3. Searching for a Document by ID and Editing a Specific Key (PUT Request)

While it's not a traditional "search," you directly reference a document by its ID in Firestore. To update a specific key, 
you can use the updateDoc function. This is like a PUT request because you're replacing a specific field within the document.

Here's how to do it:

*/
// import { getFirestore, doc, updateDoc, serverTimestamp } from "firebase/firestore";




/*
async function updateDocumentField(collectionName: string, documentId: string, fieldToUpdate: string, newValue: any) {
  const db = getFirestore();
  const docRef = doc(db, collectionName, documentId);

  try {
    await updateDoc(docRef, {
      [fieldToUpdate]: newValue,
      updatedAt: serverTimestamp(), // Update the timestamp as well
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error; // Re-throw the error to handle it upstream
  }
}

// Example usage:
const documentIdToUpdate = "your_document_id";
const fieldToUpdate = "description";
const newValue = "This is the updated description.";

updateDocumentField("myCollection", documentIdToUpdate, fieldToUpdate, newValue)
  .then(() => {
    console.log("Update successful");
  })
  .catch((error) => {
    console.error("Update failed:", error);
  });


  /*
Explanation:

updateDoc(docRef, { [fieldToUpdate]: newValue }) : This function updates the specified field ( fieldToUpdate ) with the 
newValue in the document. The [fieldToUpdate] syntax is using computed property names in JavaScript, allowing you to 
dynamically specify the field to update.

updatedAt: serverTimestamp() : It's a good practice to update the updatedAt timestamp whenever you modify the document, 
to keep track of when the changes occurred.

Important Considerations:

Error Handling: Always include proper error handling to catch potential issues during Firestore operations. 
This helps in debugging and provides a better user experience.

Security Rules: Make sure your Firestore Security Rules are properly configured to protect your data. You can 
define rules to control who can read, write, and delete data in your database.

Data Validation: Before adding or updating data, consider validating the data on the client-side to ensure it meets 
your requirements.

With these code snippets and explanations, you should be well-equipped to perform these common Firestore operations 
in your Web app. Let me know if you have any more questions!
  */

