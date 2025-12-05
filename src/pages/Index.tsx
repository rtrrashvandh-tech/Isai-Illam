import { useState } from "react";
import { Music, Sparkles } from "lucide-react";
import MusicNotes from "@/components/MusicNotes";
import RegistrationForm from "@/components/RegistrationForm";
import SuccessScreen from "@/components/SuccessScreen";
import upiQrPlaceholder from "@/assets/upi-qr-placeholder.png";

const Index = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <MusicNotes />
      
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Hero Section */}
        <header className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Rotaract Club Of KPRCAS Organises </span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-gradient-gold">ISAI ILLAM</span>
          </h1>
          
          <p className="font-display text-xl md:text-2xl text-muted-foreground mb-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            A Musical Night
          </p>
          
          <div className="flex items-center justify-center gap-2 text-primary/80 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Music className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Experience the magic of music</span>
            <Music className="w-5 h-5" />
          </div>
        </header>

        {!isRegistered ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Payment QR Section */}
            <section className="order-2 lg:order-1 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-6">
                  <span className="text-foreground">Scan & Pay to Confirm Your</span>
                  <br />
                  <span className="text-gradient-gold">ISAI ILLAM Event Entry</span>
                </h2>
                
                <div className="flex justify-center mb-6">
                  <div className="relative p-1 rounded-xl bg-gradient-to-br from-primary to-gold-light">
                    <div className="bg-card rounded-lg p-2">
                      <img
                        src={upiQrPlaceholder}
                        alt="UPI Payment QR Code for ISAI ELLAM event registration"
                        className="w-56 h-56 md:w-64 md:h-64 object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-3">
                  <p className="text-muted-foreground text-sm">
                    Scan the QR code using any UPI app to complete your payment
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground/70">
                    <span className="bg-secondary/50 px-3 py-1 rounded-full">Google Pay</span>
                    <span className="bg-secondary/50 px-3 py-1 rounded-full">PhonePe</span>
                    <span className="bg-secondary/50 px-3 py-1 rounded-full">Paytm</span>
                    <span className="bg-secondary/50 px-3 py-1 rounded-full">BHIM</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Registration Form Section */}
            <section className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
                  Register Now
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Fill in your details and upload payment proof
                </p>
                
                <RegistrationForm onSuccess={() => setIsRegistered(true)} />
              </div>
            </section>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 shadow-card">
              <SuccessScreen />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-muted-foreground/60 text-sm">
          <p>© 2024 Rotaract Club Of KPRCAS | ISAI ILLAM – A Musical Night</p>
        </footer>
      </div>
    </main>
  );
};

export default Index;
