import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DollarSign, Settings } from "lucide-react";

export function DonationEmbed({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [minimumAmount, setMinimumAmount] = useState("0.01");
  const [suggestedAmount, setSuggestedAmount] = useState("0.1");
  const [customMessage, setCustomMessage] = useState("");

  const handleSave = () => {
    // Here you would typically save these settings to your backend or smart contract
    console.log("Saving donation settings:", {
      isEnabled,
      minimumAmount,
      suggestedAmount,
      customMessage,
      contractAddress,
    });
    // Add actual save logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Donation Settings</span>
          <Settings className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            id="donation-toggle"
          />
          <Label htmlFor="donation-toggle">Enable donations</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum-amount">Minimum donation amount (ETH)</Label>
          <Input
            id="minimum-amount"
            type="number"
            value={minimumAmount}
            onChange={(e) => setMinimumAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="suggested-amount">
            Suggested donation amount (ETH)
          </Label>
          <Input
            id="suggested-amount"
            type="number"
            value={suggestedAmount}
            onChange={(e) => setSuggestedAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-message">Custom message (optional)</Label>
          <Input
            id="custom-message"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Support our project!"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>

        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold mb-2">Preview</h4>
          <Card className="bg-gray-100">
            <CardContent className="p-4">
              <p className="text-sm mb-2">
                {customMessage || "Support our project!"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Suggested: {suggestedAmount} ETH
                </span>
                <Button size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
