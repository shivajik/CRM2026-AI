import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser, setUser } from "@/lib/auth";
import { usersApi, authApi } from "@/lib/api";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Save, ArrowLeft, Camera, Phone, Briefcase, Upload, X } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const user = getUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        jobTitle: currentUser.jobTitle || "",
      });
      if (currentUser.profileImageUrl) {
        setPreviewImage(currentUser.profileImageUrl);
      }
    }
  }, [currentUser]);

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: usersApi.uploadProfileImage,
    onSuccess: (data) => {
      setPreviewImage(data.profileImageUrl);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "Image uploaded",
        description: "Your profile image has been updated successfully.",
      });
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, GIF, or WebP).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setPreviewImage(imageData);
      uploadImageMutation.mutate(imageData);
    };
    reader.onerror = () => {
      toast({
        title: "Read error",
        description: "Failed to read the image file.",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    updateProfileMutation.mutate({ ...formData, profileImageUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getInitials = () => {
    const first = formData.firstName?.charAt(0) || "";
    const last = formData.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container max-w-2xl py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setLocation("/app")}
            data-testid="button-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                My Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <form onSubmit={handleSaveChanges} className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-4">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
                        {previewImage ? (
                          <AvatarImage src={previewImage} alt="Profile" />
                        ) : null}
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-change-photo"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-medium">
                        {formData.firstName} {formData.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                      {formData.jobTitle && (
                        <p className="text-sm text-muted-foreground mt-1">{formData.jobTitle}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          data-testid="button-upload-photo"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {previewImage ? "Change Photo" : "Upload Photo"}
                        </Button>
                        {previewImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            disabled={isUploading || updateProfileMutation.isPending}
                            data-testid="button-remove-photo"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        data-testid="input-profile-image"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Enter first name"
                        data-testid="input-profile-first-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Enter last name"
                        data-testid="input-profile-last-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        placeholder="Enter email address"
                        data-testid="input-profile-email"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                          placeholder="Enter phone number"
                          data-testid="input-profile-phone"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="jobTitle"
                          value={formData.jobTitle}
                          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                          className="pl-10"
                          placeholder="Enter job title"
                          data-testid="input-profile-job-title"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending || isUploading}
                      data-testid="button-save-profile"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
