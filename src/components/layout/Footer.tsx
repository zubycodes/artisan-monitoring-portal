import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="py-6 md:py-8 mt-auto">
      <div className="container">
        <Separator className="mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xs text-muted-foreground">
              Artisan Directory | Developed by{" "}
              <a href="https://www.processjunction.com" target="_blank" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ProcessJunction Pvt. Ltd
              </a>
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="text-xs text-muted-foreground">
              © 2025 Punjab Small Industries Corporation. All rights reserved.
            </span>
            {/* <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
