import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Gift, ArrowRight } from "lucide-react";

interface ExitIntentModalProps {
  onClose?: () => void;
}

export function ExitIntentModal({ onClose }: ExitIntentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("exit-intent-shown");
    if (hasSeenModal) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exit-intent-shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        onClose?.();
      }, 2000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md" data-testid="modal-exit-intent">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          data-testid="button-close-exit-modal"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {!isSubmitted ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl">Wait! Here's a special offer</DialogTitle>
              <DialogDescription className="text-base mt-2">
                Get our exclusive CRM guide and 20% off your first year when you 
                subscribe to our newsletter. We share practical tips that actually help 
                teams close more deals.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
                data-testid="input-exit-email"
              />
              <Button type="submit" className="w-full h-12" data-testid="button-exit-submit">
                Get My 20% Discount
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle className="text-xl mb-2">You're all set!</DialogTitle>
            <DialogDescription>
              Check your inbox for the guide and your discount code.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
