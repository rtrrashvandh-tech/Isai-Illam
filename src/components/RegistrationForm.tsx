import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, CheckCircle, User, Building, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  clubName: z
    .string()
    .trim()
    .min(2, "Club name must be at least 2 characters")
    .max(100, "Club name must be less than 100 characters"),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSuccess: () => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError("Please upload a JPG, PNG, or PDF file");
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // 🔥 Updated onSubmit with Netlify Serverless Endpoint
  const onSubmit = async (data: RegistrationFormData) => {
    if (!file) {
      setFileError("Please upload your payment screenshot");
      return;
    }

    setIsSubmitting(true);

    try {
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const formData = {
        fullName: data.fullName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        clubName: data.clubName,
        paymentScreenshot: fileBase64,
        event: "Isai Illam",
      };

      // 🎯 Netlify Serverless Function Endpoint
      // Using /api/register which will be redirected to /.netlify/functions/api/register
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMessage = "Registration failed";
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch (textError) {
            errorMessage = `Registration failed with status ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      const result = await response.json();

      toast({
        title: "Registration Successful!",
        description:
          "Your e-pass has been sent to your email. Please check your inbox.",
      });

      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Full Name
        </Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-destructive text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* Club Name */}
      <div className="space-y-2">
        <Label htmlFor="clubName" className="text-foreground flex items-center gap-2">
          <Building className="w-4 h-4 text-primary" />
          Club Name
        </Label>
        <Input
          id="clubName"
          placeholder="Enter your Rotaract club name"
          className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
          {...register("clubName")}
        />
        {errors.clubName && (
          <p className="text-destructive text-sm">{errors.clubName.message}</p>
        )}
      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <Label htmlFor="mobileNumber" className="text-foreground flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          Mobile Number
        </Label>
        <Input
          id="mobileNumber"
          placeholder="10-digit mobile number"
          maxLength={10}
          className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
          {...register("mobileNumber")}
        />
        {errors.mobileNumber && (
          <p className="text-destructive text-sm">{errors.mobileNumber.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Email ID
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          className="bg-secondary/50 border-border focus:border-primary focus:ring-primary"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Payment Screenshot */}
      <div className="space-y-2">
        <Label htmlFor="paymentScreenshot" className="text-foreground flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          Payment Screenshot
        </Label>
        <div className="relative">
          <input
            id="paymentScreenshot"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="paymentScreenshot"
            className={`flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
              file
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 bg-secondary/30"
            }`}
          >
            {file ? (
              <>
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground truncate max-w-[200px]">
                  {file.name}
                </span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Click to upload (JPG, PNG, PDF)
                </span>
              </>
            )}
          </label>
        </div>
        {fileError && <p className="text-destructive text-sm">{fileError}</p>}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg shadow-gold transition-all duration-300 hover:shadow-[0_6px_40px_hsl(38_92%_55%_/_0.5)]"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          "Complete Registration"
        )}
      </Button>
    </form>
  );
};

export default RegistrationForm;
