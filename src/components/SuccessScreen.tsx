import { CheckCircle, ExternalLink, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/DDyGAYOvGe4K0vqzlzzZWh";

const SuccessScreen = () => {
  return (
    <div className="text-center space-y-8 animate-scale-in">
      {/* Success Icon */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-14 h-14 text-primary" />
        </div>
        <Music className="absolute -top-2 -right-2 w-8 h-8 text-primary animate-float" />
      </div>

      {/* Success Message */}
      <div className="space-y-3">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Registration <span className="text-gradient-gold">Successful!</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Thank you for registering for ISAI ILLAM – A Musical Night. 
          We're excited to have you join us!
        </p>
      </div>

      {/* WhatsApp Group CTA */}
      <div className="bg-card/50 border border-border rounded-2xl p-6 space-y-4">
        <p className="text-foreground font-medium">
          Join our WhatsApp group for event updates and coordination
        </p>
        <Button
          asChild
          className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-6 px-8 text-lg gap-2"
        >
          <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">
            Join WhatsApp Group
            <ExternalLink className="w-5 h-5" />
          </a>
        </Button>
      </div>

      {/* Additional Info */}
      <p className="text-muted-foreground text-sm">
        If you have any questions, please contact us through the WhatsApp group.
      </p>
    </div>
  );
};

export default SuccessScreen;
