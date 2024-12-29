import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import Cookies from 'js-cookie';
import Images1 from '../assets/Images1.jpg';
import Images2 from '../assets/images2.jpeg';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";


const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const { toast } = useToast();
    const [error , setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

    const onSubmit = async (values: z.infer<typeof signupSchema>) => {
      console.log(values);                                                                      
    try {
      setLoading(true);
      // Simulate API call
        await axios.post("http://localhost:3000/user/signup", values).then((res) => {
            if (res.status === 400) {
                setError(res.data.message);
            } else if (res.status === 500) {
                setError("Error creating user");
            } else {
                Cookies.set('token', res.data.token);
                Cookies.set('user', res.data.user._id);
                toast({
                    title: "User created successfully!",
                    description: "Welcome to Levitation Infotech.",
                });
                navigate("/dashboard");
                
            }
        }).catch((err) => {
            console.log(err);
        });
      
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#0A0A0A] font-poppins">
      {/* Background gradient circles - adjusted for better mobile view */}
      <div className="absolute top-[-10%] right-[-20%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-r from-[#98EC2D]/20 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-r from-[#98EC2D]/10 to-transparent blur-3xl" />

      <div className="relative mx-auto h-full flex flex-col">
        {/* Header - made padding responsive */}
        <header className="py-4 flex justify-between items-center bg-[#1F1F1F] px-4 sm:px-8 md:px-20">
          <img src={Images1} alt="Levitation" className="h-6 md:h-8 font-canva-sans" />
          <Button 
            variant="outline" 
            className="border-[#CCF575] text-[#CCF575] hover:bg-[#CCF575]/10 hover:text-[#CCF575]"
          >
            <Link to="/login">Login</Link>
          </Button>
        </header>

        {/* Main content - adjusted padding and layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 flex-1 py-4 md:py-8 px-4 sm:px-8 md:px-20">
          {/* Left side content */}
          <div className="space-y-6 w-full max-w-2xl mx-auto">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight font-pretendard">
                Sign up to begin journey
              </h1>
              <p className="text-gray-400 text-lg">
                This is basic signup page which is used for levitation assignment purpose.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-white text-sm font-poppins">Enter your name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Email ID" 
                          {...field}
                          className="h-10 w-full max-w-md bg-[#202020] border border-[#424647] focus:border-[#dcf0c3] focus:ring-[#98EC2D]/20 text-white font-poppins text-sm" 
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 font-poppins">This name will be displayed with your inquiry</p>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-white text-sm font-poppins">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Email ID" 
                          type="email" 
                          {...field}
                          className="h-10 w-full max-w-md bg-[#202020] border border-[#424647] focus:border-[#dcf0c3] focus:ring-[#98EC2D]/20 text-white font-poppins text-sm" 
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 font-poppins">This email will be displayed with your inquiry</p>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-white text-sm font-poppins">Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter the Password" 
                          type="password" 
                          {...field}
                          className="h-10 w-full max-w-md bg-[#202020] border border-[#424647] focus:border-[#dcf0c3] focus:ring-[#98EC2D]/20 text-white font-poppins text-sm" 
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 font-poppins">Any further updates will be forwarded on this Email ID</p>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#141414] to-[#303030] text-[#98EC2D] hover:bg-[#98EC2D]/90 px-8 h-10 text-sm font-medium"
                    disabled={loading}
                  >
                    Register
                  </Button>
                  <span className="text-gray-500">Already have account ?</span>
                </div>
              </form>
            </Form>
          </div>

          {/* Right side image - made responsive */}
          <div className="hidden lg:flex lg:items-center">
            <div className="relative w-full aspect-[4/3] max-w-2xl mx-auto">
              <img
                src={Images2}
                alt="Connecting People With Technology"
                className="w-full h-full object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;