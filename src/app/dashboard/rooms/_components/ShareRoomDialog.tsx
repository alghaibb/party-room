"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconCopy,
  IconCheck,
  IconShare,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface ShareRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomCode: string;
  roomName: string;
}

export function ShareRoomDialog({
  open,
  onOpenChange,
  roomCode,
  roomName,
}: ShareRoomDialogProps) {
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/join/${roomCode}`);
    }
  }, [roomCode]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success(`Room code ${roomCode} copied!`);
    } catch (error) {
      console.error("Error copying code:", error);
      toast.error("Failed to copy room code");
    }
  };

  const shareText = `Join me in "${roomName}" on Party Room! Room code: ${roomCode}`;
  const shareUrl = inviteLink;

  const handleSocialShare = (platform: string) => {
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    };

    const url = urls[platform];
    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShare className="w-5 h-5" />
            Share Room
          </DialogTitle>
          <DialogDescription>
            Invite friends to join <strong>&quot;{roomName}&quot;</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invite Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Invite Link</label>
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="font-mono text-sm"
                onClick={handleCopyLink}
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                {copied ? (
                  <IconCheck className="w-4 h-4 text-green-600" />
                ) : (
                  <IconCopy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link for one-click join
            </p>
          </div>

          {/* Room Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Room Code</label>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="text-lg font-mono px-4 py-2 rounded-full border-foreground/20 flex-1 justify-center cursor-pointer hover:bg-accent/50"
                onClick={handleCopyCode}
              >
                {roomCode}
              </Badge>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <IconCopy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Or share the room code directly
            </p>
          </div>

          {/* Social Sharing */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share on</label>
            <div className="flex gap-2">
              <Button
                onClick={() => handleSocialShare("twitter")}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <IconBrandTwitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare("facebook")}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <IconBrandFacebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                onClick={() => handleSocialShare("whatsapp")}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <IconBrandWhatsapp className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

