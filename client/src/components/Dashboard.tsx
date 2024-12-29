import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const { toast } = useToast();
  const [pdfData, setPdfData] = useState<Blob | null>(null);
    const navigate = useNavigate();
    const userId = Cookies.get('user');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const price = parseFloat(formValues.price);
    const quantity = parseInt(formValues.quantity, 10);
    
    if (isNaN(price) || isNaN(quantity)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Price and quantity must be valid numbers.",
      });
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: formValues.name,
      price,
      quantity,
    };

      setProducts((prevProducts) => [...prevProducts, product]);
      
    toast({
      title: "Product added successfully!",
    });
      

    // Reset the form
    setFormValues({
      name: "",
      price: "",
      quantity: "",
    });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleGeneratePDF = async () => {
    if (products.length === 0) {
      toast({
        variant: "destructive",
        title: "No products",
        description: "Please add at least one product to generate an invoice.",
      });
      return;
    }
  
    try {
      // Debugging information
      console.log("Products:", products);
      console.log("User ID:", userId);
      console.log(
        "Total Amount:",
        products.reduce((sum, product) => sum + product.price * product.quantity, 0)
      );
  
      // API call to create the PDF
      const response = await axios.post(
        "http://localhost:3000/bill/create",
        {
          userId,
          amount: products.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0
          ),
          products,
        },
        {
          headers: {
            Accept: "application/pdf",
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
      console.log("Response:", response.data);
      // Create a URL for the Blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      console.log("URL:", url);
  
      // Create an anchor tag and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      link.setAttribute("download", "invoice.pdf"); // Set the filename
      document.body.appendChild(link); // Append to the DOM
      link.click(); // Trigger download
      link.remove(); // Remove from the DOM
      window.URL.revokeObjectURL(url); // Release the object URL
  
      // Show success toast
      toast({
        title: "Invoice Generated",
        description: "Your invoice has been downloaded successfully.",
      });
    } catch (error : any) {
      console.error("Error generating invoice:", error);
  
      // Show error toast with a relevant message
      toast({
        variant: "destructive",
        title: "Failed to generate invoice",
        description:
          error.response?.data?.message ||
          "An error occurred while generating the invoice.",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white rounded-lg" />
            <span className="text-white font-medium">levitation</span>
            <span className="text-gray-400 text-sm">infotech</span>
          </div>
          <Button
            variant="outline"
            className="bg-[#CBFB45] text-black hover:bg-[#CBFB45]/90 rounded-md px-6"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Add Products</h1>
          <p className="text-gray-400">
            This is a basic login page used for the levitation assignment purpose.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-white">Product Name</label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              placeholder="Enter the product name"
              className="bg-[#1A1A1A] border border-gray-800 rounded-md p-3 text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-white">Product Price</label>
            <input
              type="text"
              name="price"
              value={formValues.price}
              onChange={handleInputChange}
              placeholder="Enter the price"
              className="bg-[#1A1A1A] border border-gray-800 rounded-md p-3 text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-white">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={formValues.quantity}
              onChange={handleInputChange}
              placeholder="Enter the Qty"
              className="bg-[#1A1A1A] border border-gray-800 rounded-md p-3 text-white"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={handleSubmit}
            className="bg-[#CBFB45] text-black hover:bg-[#CBFB45]/90 rounded-md px-6 flex items-center gap-2"
          >
            Add Product <span className="text-xl">+</span>
          </Button>
        </div>

        {products.length > 0 && (
          <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
            <table className="w-full text-white">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left p-4">Product Name</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-right p-4">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-800">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">₹{product.price.toFixed(2)}</td>
                    <td className="p-4">{product.quantity}</td>
                    <td className="p-4 text-right">
                      ₹{(product.price * product.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-gray-800">
                <tr>
                  <td colSpan={3} className="text-right p-4">
                    Sub-Total
                  </td>
                  <td className="text-right p-4">
                    ₹
                    {products
                      .reduce(
                        (sum, product) =>
                          sum + product.price * product.quantity,
                        0
                      )
                      .toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right p-4">
                    Incl + GST 18%
                  </td>
                  <td className="text-right p-4">
                    ₹
                    {(
                      products.reduce(
                        (sum, product) =>
                          sum + product.price * product.quantity,
                        0
                      ) * 1.18
                    ).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {products.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleGeneratePDF}
              className="bg-[#2A2A2A] text-[#CBFB45] hover:bg-[#2A2A2A]/90 rounded-md px-8 py-3"
            >
              Generate PDF Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;



// http://localhost:3000/bill/create
// {
//     "userId": "676daa872ebacf621aab0b1e",
//     "amount": 1651,
//     "products": [
//       {
//         "name": "Tushar",
//         "price": 500,
//         "quantity": 2
//       },
//       {
//         "name": "Aman",
//         "price": 651,
//         "quantity": 1
//       }
//     ]
//   }