"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { Shield, Smartphone, User, Mail, Upload, X, FileText, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [mfa, setMfa] = useState(false);
  const [country, setCountry] = useState(user?.countryCode || "US");

  // KYC Upload State
  const [showKycForm, setShowKycForm] = useState(false);
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentExpDate, setDocumentExpDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleKycSubmit = async () => {
    if (!documentFront || !documentBack || !documentNumber || !documentExpDate) {
      alert("Please fill in all fields and upload both document images");
      return;
    }

    // Validate expiry date is in the future
    const expiry = new Date(documentExpDate);
    const today = new Date();
    if (expiry < today) {
      alert("Document expiry date must be in the future");
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("documentFront", documentFront);
      formData.append("documentBack", documentBack);
      formData.append("documentNumber", documentNumber);
      formData.append("documentExpDate", documentExpDate);
      formData.append("name", user?.name?.full || "");
      formData.append("email", user?.email || "");

      setUploadProgress(30);

      const token = localStorage.getItem("token");
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      setUploadProgress(50);

      const response = await fetch("/api/kycs", {
        method: "POST",
        headers,
        body: formData,
      });

      setUploadProgress(80);

      if (response.ok) {
        setUploadProgress(100);
        alert("KYC documents submitted successfully! Admin will review your submission.");

        // Reset form
        setShowKycForm(false);
        setDocumentFront(null);
        setDocumentBack(null);
        setDocumentNumber("");
        setDocumentExpDate("");
      } else {
        const error = await response.json();
        alert(`Failed to submit KYC: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("KYC submission error:", error);
      alert("Failed to submit KYC documents. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleMfa = () => {
    setMfa((prev) => !prev);
    alert("MFA toggled. Use your authenticator to complete setup.");
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const getKycBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "verified":
        return <Badge variant="success">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="outline">Not Submitted</Badge>;
    }
  };

  // Format member since date
  const formatMemberSince = (date: string | Date | undefined) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Profile & Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Update profile, KYC, and MFA preferences.</p>
      </div>

      {/* Account Overview Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="glass" padding="lg">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Account Status</p>
            <div className="flex items-center gap-2">
              {getStatusBadge(user?.accountStatus || "active")}
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">KYC Status</p>
            <div className="flex items-center gap-2">
              {getKycBadge(user?.kycStatus || "not submitted")}
            </div>
          </div>
        </Card>

        <Card variant="glass" padding="lg">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Member Since</p>
            <p className="text-sm font-medium">{formatMemberSince(user?.createdAt)}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Profile
            </div>
            <CardTitle className="text-lg">Identity</CardTitle>
            <CardDescription>Basic details used across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input defaultValue={user?.name?.full || "User"} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={user?.email ?? "user@example.com"} />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} />
            </div>
            <Button className="w-full" variant="primary-purple">
              Save profile
            </Button>
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg" hover="lift">
          <CardHeader className="p-0 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              Compliance
            </div>
            <CardTitle className="text-lg">KYC & MFA</CardTitle>
            <CardDescription>Submit documents and secure your account.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="rounded-lg border border-border px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">KYC status</p>
                  <p className="text-xs text-muted-foreground">Upload identity documents for verification</p>
                </div>
                {getKycBadge(user?.kycStatus || "not submitted")}
              </div>

              {!showKycForm ? (
                <Button size="sm" onClick={() => setShowKycForm(true)} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Submit documents
                </Button>
              ) : (
                <div className="space-y-4 pt-3 border-t border-border">
                  {/* Document Front Upload */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Document Front (ID, Passport, etc.)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => setDocumentFront(e.target.files?.[0] || null)}
                        className="text-xs"
                      />
                      {documentFront && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          {documentFront.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Back Upload */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Document Back</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => setDocumentBack(e.target.files?.[0] || null)}
                        className="text-xs"
                      />
                      {documentBack && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                          {documentBack.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Number */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Document Number</Label>
                    <Input
                      placeholder="e.g., ABC123456789"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Expiry Date</Label>
                    <Input
                      type="date"
                      value={documentExpDate}
                      onChange={(e) => setDocumentExpDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="text-sm"
                    />
                  </div>

                  {/* Upload Progress */}
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Uploading...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-accent-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleKycSubmit}
                      disabled={uploading}
                      className="flex-1 gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Submit KYC"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowKycForm(false);
                        setDocumentFront(null);
                        setDocumentBack(null);
                        setDocumentNumber("");
                        setDocumentExpDate("");
                      }}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Accepted formats: JPG, PNG. Max file size: 5MB per image.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Multi-factor Authentication</p>
                  <p className="text-xs text-muted-foreground">TOTP or email OTP</p>
                </div>
                <Badge variant={mfa ? "success" : "outline"}>{mfa ? "Enabled" : "Disabled"}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Smartphone className="h-4 w-4" />
                Use any authenticator; QR flow is handled later.
              </div>
              <Button size="sm" variant="outline" onClick={handleMfa}>
                {mfa ? "Disable MFA" : "Enable MFA"}
              </Button>
            </div>

            <div className="rounded-lg border border-border px-4 py-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Notifications
              </div>
              <p className="text-xs text-muted-foreground">
                Admin can send compliance emails; you can opt-in/out once backend is wired.
              </p>
              <Button size="sm" variant="ghost">
                Manage preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
