import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUser, setUser } from "@/lib/auth";
import { usersApi, companyProfileApi, emailApi, userAiApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Building2, Globe, Phone, MapPin, FileText, DollarSign, Upload, Camera, ImageIcon, Server, Check, X, Loader2, Sparkles, Key, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const user = getUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(user?.profileImageUrl || "");
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    logoUrl: "",
    taxId: "",
    registrationNumber: "",
    industry: "",
    companySize: "",
    currency: "USD",
    defaultPaymentTerms: "net30",
    invoicePrefix: "INV",
    quotePrefix: "QT",
    invoiceNotes: "",
    quoteNotes: "",
  });

  const [smtpData, setSmtpData] = useState({
    provider: "default",
    smtpHost: "",
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "",
    fromName: "",
    replyToEmail: "",
    apiKey: "",
    apiDomain: "",
    isEnabled: true,
  });

  const [aiSettings, setAiSettings] = useState({
    openaiApiKey: "",
    isEnabled: false,
    provider: "openai",
  });
  const [showApiKey, setShowApiKey] = useState(false);

  const { data: smtpSettings, isLoading: isLoadingSmtp } = useQuery({
    queryKey: ["smtp-settings"],
    queryFn: emailApi.getSmtpSettings,
  });

  const { data: userAiSettings, isLoading: isLoadingAi } = useQuery({
    queryKey: ["user-ai-settings"],
    queryFn: userAiApi.getSettings,
  });

  useEffect(() => {
    if (userAiSettings) {
      setAiSettings({
        openaiApiKey: "",
        isEnabled: userAiSettings.isEnabled || false,
        provider: userAiSettings.provider || "openai",
      });
    }
  }, [userAiSettings]);

  const updateAiSettingsMutation = useMutation({
    mutationFn: userAiApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-ai-settings"] });
      toast({
        title: "AI settings updated",
        description: "Your AI preferences have been saved successfully.",
      });
      setAiSettings(prev => ({ ...prev, openaiApiKey: "" }));
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update AI settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (smtpSettings) {
      setSmtpData({
        provider: smtpSettings.provider || "default",
        smtpHost: smtpSettings.smtpHost || "",
        smtpPort: smtpSettings.smtpPort || 587,
        smtpSecure: smtpSettings.smtpSecure || false,
        smtpUser: smtpSettings.smtpUser || "",
        smtpPassword: "",
        fromEmail: smtpSettings.fromEmail || "",
        fromName: smtpSettings.fromName || "",
        replyToEmail: smtpSettings.replyToEmail || "",
        apiKey: "",
        apiDomain: smtpSettings.apiDomain || "",
        isEnabled: smtpSettings.isEnabled ?? true,
      });
    }
  }, [smtpSettings]);

  const updateSmtpMutation = useMutation({
    mutationFn: emailApi.updateSmtpSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smtp-settings"] });
      toast({
        title: "Email settings updated",
        description: "Your email configuration has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update email settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const testSmtpMutation = useMutation({
    mutationFn: emailApi.testSmtpConnection,
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["smtp-settings"] });
      if (result.success) {
        toast({
          title: "Connection successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Connection failed",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Test failed",
        description: error.message || "Failed to test connection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveSmtpSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...smtpData };
    if (!dataToSend.smtpPassword) {
      delete (dataToSend as any).smtpPassword;
    }
    if (!dataToSend.apiKey) {
      delete (dataToSend as any).apiKey;
    }
    updateSmtpMutation.mutate(dataToSend);
  };

  const { data: companyProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["company-profile"],
    queryFn: companyProfileApi.get,
  });

  useEffect(() => {
    if (companyProfile) {
      setCompanyData({
        companyName: companyProfile.companyName || "",
        email: companyProfile.email || "",
        phone: companyProfile.phone || "",
        website: companyProfile.website || "",
        address: companyProfile.address || "",
        city: companyProfile.city || "",
        state: companyProfile.state || "",
        country: companyProfile.country || "",
        postalCode: companyProfile.postalCode || "",
        logoUrl: companyProfile.logoUrl || "",
        taxId: companyProfile.taxId || "",
        registrationNumber: companyProfile.registrationNumber || "",
        industry: companyProfile.industry || "",
        companySize: companyProfile.companySize || "",
        currency: companyProfile.currency || "USD",
        defaultPaymentTerms: companyProfile.defaultPaymentTerms || "net30",
        invoicePrefix: companyProfile.invoicePrefix || "INV",
        quotePrefix: companyProfile.quotePrefix || "QT",
        invoiceNotes: companyProfile.invoiceNotes || "",
        quoteNotes: companyProfile.quoteNotes || "",
      });
    }
  }, [companyProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
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

  const updateCompanyMutation = useMutation({
    mutationFn: companyProfileApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
      toast({
        title: "Company profile updated",
        description: "Your company details have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update company profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyMutation.mutate(companyData);
  };

  const getInitials = () => {
    const first = formData.firstName?.charAt(0) || "";
    const last = formData.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const handleImageUpload = async (
    file: File,
    type: 'profile' | 'logo'
  ) => {
    if (!file) return;
    
    if (type === 'profile' && isUploadingProfile) return;
    if (type === 'logo' && isUploadingLogo) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    if (type === 'profile') {
      setIsUploadingProfile(true);
    } else {
      setIsUploadingLogo(true);
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const previousProfileUrl = profileImageUrl;
      const previousLogoUrl = companyData.logoUrl;
      
      const getUploadErrorMessage = (error: any): string => {
        const errorMessage = error?.message?.toLowerCase() || '';
        if (errorMessage.includes('entity too large') || errorMessage.includes('too large') || errorMessage.includes('payload too large')) {
          return "The file is too large. Please select an image smaller than 2MB.";
        }
        if (errorMessage.includes('timeout')) {
          return "Upload timed out. Please try with a smaller image.";
        }
        return error.message || "Failed to upload. Please try again.";
      };

      if (type === 'profile') {
        setProfileImageUrl(base64);
        try {
          const updatedUser = await usersApi.updateProfile({ profileImageUrl: base64 });
          setUser(updatedUser);
          toast({
            title: "Profile image updated",
            description: "Your profile picture has been updated successfully.",
          });
        } catch (error: any) {
          toast({
            title: "Upload failed",
            description: getUploadErrorMessage(error),
            variant: "destructive",
          });
          setProfileImageUrl(previousProfileUrl);
        } finally {
          setIsUploadingProfile(false);
        }
      } else {
        setCompanyData({ ...companyData, logoUrl: base64 });
        try {
          await companyProfileApi.update({ logoUrl: base64 });
          queryClient.invalidateQueries({ queryKey: ["company-profile"] });
          toast({
            title: "Company logo updated",
            description: "Your company logo has been updated successfully.",
          });
        } catch (error: any) {
          toast({
            title: "Upload failed",
            description: getUploadErrorMessage(error),
            variant: "destructive",
          });
          setCompanyData({ ...companyData, logoUrl: previousLogoUrl });
        } finally {
          setIsUploadingLogo(false);
        }
      }
    };
    reader.onerror = () => {
      toast({
        title: "Read failed",
        description: "Failed to read the image file. Please try again.",
        variant: "destructive",
      });
      if (type === 'profile') {
        setIsUploadingProfile(false);
      } else {
        setIsUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file, 'profile');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file, 'logo');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col gap-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and company preferences.</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
              <TabsTrigger value="company" data-testid="tab-company">Company</TabsTrigger>
              <TabsTrigger value="email" data-testid="tab-email">Email</TabsTrigger>
              <TabsTrigger value="ai" data-testid="tab-ai">AI Preferences</TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <Avatar className="h-16 w-16">
                        {profileImageUrl ? (
                          <AvatarImage src={profileImageUrl} alt="Profile" />
                        ) : null}
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => !isUploadingProfile && profileInputRef.current?.click()}
                        className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity cursor-pointer ${isUploadingProfile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        disabled={isUploadingProfile}
                        data-testid="button-upload-profile-image"
                      >
                        {isUploadingProfile ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Camera className="h-5 w-5 text-white" />
                        )}
                      </button>
                      <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                        data-testid="input-profile-image"
                      />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your personal details and email settings.</CardDescription>
                      <div className="mt-2 p-2 bg-muted/50 rounded-md">
                        <p className="text-xs text-muted-foreground">
                          <strong>Photo upload:</strong> Hover over avatar and click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supported formats: PNG, JPG, GIF. Max size: 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input 
                          id="firstName" 
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Enter your first name"
                          data-testid="input-firstname" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input 
                          id="lastName" 
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Enter your last name"
                          data-testid="input-lastname" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        data-testid="input-email" 
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                        data-testid="button-save-changes"
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions that affect your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                    </div>
                    <Button variant="destructive" data-testid="button-delete-account">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="space-y-6 mt-6">
              <form onSubmit={handleSaveCompanyProfile}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                    <CardDescription>
                      Your company details will appear on invoices, quotes, and other documents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Company Logo
                      </Label>
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 overflow-hidden">
                            {companyData.logoUrl ? (
                              <img 
                                src={companyData.logoUrl} 
                                alt="Company Logo" 
                                className="h-full w-full object-contain"
                              />
                            ) : (
                              <Building2 className="h-8 w-8 text-muted-foreground/50" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
                            className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg transition-opacity cursor-pointer ${isUploadingLogo ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            disabled={isUploadingLogo}
                            data-testid="button-upload-company-logo"
                          >
                            {isUploadingLogo ? (
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Upload className="h-5 w-5 text-white" />
                            )}
                          </button>
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            data-testid="input-company-logo"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="p-2 bg-muted/50 rounded-md">
                            <p className="text-sm text-muted-foreground">
                              Upload your company logo. This will appear on invoices, quotes, and other documents.
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              <strong>Requirements:</strong> PNG, JPG, or GIF format. Max size: 2MB. Recommended: 200x200px square image for best results.
                            </p>
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => logoInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            data-testid="button-change-logo"
                          >
                            {isUploadingLogo ? (
                              <>
                                <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                {companyData.logoUrl ? "Change Logo" : "Upload Logo"}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input 
                          id="companyName" 
                          value={companyData.companyName}
                          onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                          placeholder="Your Company Name"
                          required
                          data-testid="input-company-name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyEmail" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Company Email
                        </Label>
                        <Input 
                          id="companyEmail" 
                          type="email"
                          value={companyData.email}
                          onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                          placeholder="contact@company.com"
                          data-testid="input-company-email" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyPhone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </Label>
                        <Input 
                          id="companyPhone" 
                          value={companyData.phone}
                          onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          data-testid="input-company-phone" 
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="companyWebsite" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Website
                        </Label>
                        <Input 
                          id="companyWebsite" 
                          value={companyData.website}
                          onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                          placeholder="https://www.yourcompany.com"
                          data-testid="input-company-website" 
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5" />
                        Address
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input 
                            id="address" 
                            value={companyData.address}
                            onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                            placeholder="123 Business Street"
                            data-testid="input-company-address" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            value={companyData.city}
                            onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                            placeholder="New York"
                            data-testid="input-company-city" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State / Province</Label>
                          <Input 
                            id="state" 
                            value={companyData.state}
                            onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
                            placeholder="NY"
                            data-testid="input-company-state" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input 
                            id="postalCode" 
                            value={companyData.postalCode}
                            onChange={(e) => setCompanyData({ ...companyData, postalCode: e.target.value })}
                            placeholder="10001"
                            data-testid="input-company-postal" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input 
                            id="country" 
                            value={companyData.country}
                            onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
                            placeholder="United States"
                            data-testid="input-company-country" 
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5" />
                        Legal & Tax Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                          <Input 
                            id="taxId" 
                            value={companyData.taxId}
                            onChange={(e) => setCompanyData({ ...companyData, taxId: e.target.value })}
                            placeholder="XX-XXXXXXX"
                            data-testid="input-company-taxid" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Registration Number</Label>
                          <Input 
                            id="registrationNumber" 
                            value={companyData.registrationNumber}
                            onChange={(e) => setCompanyData({ ...companyData, registrationNumber: e.target.value })}
                            placeholder="Company registration number"
                            data-testid="input-company-registration" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Select 
                            value={companyData.industry} 
                            onValueChange={(value) => setCompanyData({ ...companyData, industry: value })}
                          >
                            <SelectTrigger data-testid="select-industry">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="finance">Finance & Accounting</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="real-estate">Real Estate</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companySize">Company Size</Label>
                          <Select 
                            value={companyData.companySize} 
                            onValueChange={(value) => setCompanyData({ ...companyData, companySize: value })}
                          >
                            <SelectTrigger data-testid="select-company-size">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                        <DollarSign className="h-5 w-5" />
                        Invoice & Quote Settings
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Default Currency</Label>
                          <Select 
                            value={companyData.currency} 
                            onValueChange={(value) => setCompanyData({ ...companyData, currency: value })}
                          >
                            <SelectTrigger data-testid="select-currency">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                              <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                              <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentTerms">Default Payment Terms</Label>
                          <Select 
                            value={companyData.defaultPaymentTerms} 
                            onValueChange={(value) => setCompanyData({ ...companyData, defaultPaymentTerms: value })}
                          >
                            <SelectTrigger data-testid="select-payment-terms">
                              <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                              <SelectItem value="net15">Net 15</SelectItem>
                              <SelectItem value="net30">Net 30</SelectItem>
                              <SelectItem value="net45">Net 45</SelectItem>
                              <SelectItem value="net60">Net 60</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                          <Input 
                            id="invoicePrefix" 
                            value={companyData.invoicePrefix}
                            onChange={(e) => setCompanyData({ ...companyData, invoicePrefix: e.target.value })}
                            placeholder="INV"
                            data-testid="input-invoice-prefix" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quotePrefix">Quote Prefix</Label>
                          <Input 
                            id="quotePrefix" 
                            value={companyData.quotePrefix}
                            onChange={(e) => setCompanyData({ ...companyData, quotePrefix: e.target.value })}
                            placeholder="QT"
                            data-testid="input-quote-prefix" 
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="invoiceNotes">Default Invoice Notes</Label>
                          <Textarea 
                            id="invoiceNotes" 
                            value={companyData.invoiceNotes}
                            onChange={(e) => setCompanyData({ ...companyData, invoiceNotes: e.target.value })}
                            placeholder="Thank you for your business!"
                            rows={3}
                            data-testid="input-invoice-notes" 
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="quoteNotes">Default Quote Notes</Label>
                          <Textarea 
                            id="quoteNotes" 
                            value={companyData.quoteNotes}
                            onChange={(e) => setCompanyData({ ...companyData, quoteNotes: e.target.value })}
                            placeholder="This quote is valid for 30 days."
                            rows={3}
                            data-testid="input-quote-notes" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        disabled={updateCompanyMutation.isPending || isLoadingProfile}
                        data-testid="button-save-company"
                      >
                        {updateCompanyMutation.isPending ? "Saving..." : "Save Company Profile"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            <TabsContent value="email" className="space-y-6 mt-6">
              <form onSubmit={handleSaveSmtpSettings}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      Email Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure how emails are sent from your account. Choose between the default provider or set up your own SMTP server.
                    </CardDescription>
                    {smtpSettings?.isVerified && (
                      <Badge variant="secondary" className="w-fit flex items-center gap-1 mt-2">
                        <Check className="h-3 w-3" /> Connection Verified
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider">Email Provider</Label>
                        <Select 
                          value={smtpData.provider} 
                          onValueChange={(value) => setSmtpData({ ...smtpData, provider: value })}
                        >
                          <SelectTrigger data-testid="select-email-provider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default (Managed by Platform)</SelectItem>
                            <SelectItem value="smtp">Custom SMTP Server</SelectItem>
                            <SelectItem value="sendgrid">SendGrid</SelectItem>
                            <SelectItem value="mailgun">Mailgun</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {smtpData.provider === "default" 
                            ? "Use our built-in email service with no configuration needed."
                            : "Configure your own email provider for better deliverability and branding."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Enable Email Sending</Label>
                          <p className="text-sm text-muted-foreground">When disabled, no emails will be sent.</p>
                        </div>
                        <Switch 
                          checked={smtpData.isEnabled} 
                          onCheckedChange={(checked) => setSmtpData({ ...smtpData, isEnabled: checked })}
                          data-testid="switch-email-enabled" 
                        />
                      </div>
                    </div>

                    {smtpData.provider === "smtp" && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            SMTP Server Settings
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="smtpHost">SMTP Host</Label>
                              <Input 
                                id="smtpHost" 
                                value={smtpData.smtpHost}
                                onChange={(e) => setSmtpData({ ...smtpData, smtpHost: e.target.value })}
                                placeholder="smtp.example.com"
                                data-testid="input-smtp-host" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="smtpPort">SMTP Port</Label>
                              <Input 
                                id="smtpPort" 
                                type="number"
                                value={smtpData.smtpPort}
                                onChange={(e) => setSmtpData({ ...smtpData, smtpPort: parseInt(e.target.value) || 587 })}
                                placeholder="587"
                                data-testid="input-smtp-port" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="smtpUser">SMTP Username</Label>
                              <Input 
                                id="smtpUser" 
                                value={smtpData.smtpUser}
                                onChange={(e) => setSmtpData({ ...smtpData, smtpUser: e.target.value })}
                                placeholder="username@example.com"
                                data-testid="input-smtp-user" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="smtpPassword">SMTP Password</Label>
                              <Input 
                                id="smtpPassword" 
                                type="password"
                                value={smtpData.smtpPassword}
                                onChange={(e) => setSmtpData({ ...smtpData, smtpPassword: e.target.value })}
                                placeholder={smtpSettings?.hasPassword ? "••••••••" : "Enter password"}
                                data-testid="input-smtp-password" 
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              id="smtpSecure"
                              checked={smtpData.smtpSecure}
                              onCheckedChange={(checked) => setSmtpData({ ...smtpData, smtpSecure: checked })}
                              data-testid="switch-smtp-secure" 
                            />
                            <Label htmlFor="smtpSecure">Use SSL/TLS (typically for port 465)</Label>
                          </div>
                        </div>
                      </>
                    )}

                    {(smtpData.provider === "sendgrid" || smtpData.provider === "mailgun") && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            API Settings
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="apiKey">API Key</Label>
                              <Input 
                                id="apiKey" 
                                type="password"
                                value={smtpData.apiKey}
                                onChange={(e) => setSmtpData({ ...smtpData, apiKey: e.target.value })}
                                placeholder={smtpSettings?.hasApiKey ? "••••••••" : "Enter API key"}
                                data-testid="input-api-key" 
                              />
                            </div>
                            {smtpData.provider === "mailgun" && (
                              <div className="space-y-2 col-span-2">
                                <Label htmlFor="apiDomain">Domain</Label>
                                <Input 
                                  id="apiDomain" 
                                  value={smtpData.apiDomain}
                                  onChange={(e) => setSmtpData({ ...smtpData, apiDomain: e.target.value })}
                                  placeholder="mg.yourdomain.com"
                                  data-testid="input-api-domain" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {smtpData.provider !== "default" && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="font-medium flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Sender Information
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fromEmail">From Email</Label>
                              <Input 
                                id="fromEmail" 
                                type="email"
                                value={smtpData.fromEmail}
                                onChange={(e) => setSmtpData({ ...smtpData, fromEmail: e.target.value })}
                                placeholder="noreply@yourcompany.com"
                                data-testid="input-from-email" 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fromName">From Name</Label>
                              <Input 
                                id="fromName" 
                                value={smtpData.fromName}
                                onChange={(e) => setSmtpData({ ...smtpData, fromName: e.target.value })}
                                placeholder="Your Company Name"
                                data-testid="input-from-name" 
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="replyToEmail">Reply-To Email (optional)</Label>
                              <Input 
                                id="replyToEmail" 
                                type="email"
                                value={smtpData.replyToEmail}
                                onChange={(e) => setSmtpData({ ...smtpData, replyToEmail: e.target.value })}
                                placeholder="support@yourcompany.com"
                                data-testid="input-reply-to" 
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => testSmtpMutation.mutate()}
                        disabled={testSmtpMutation.isPending || updateSmtpMutation.isPending}
                        data-testid="button-test-connection"
                      >
                        {testSmtpMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          "Test Connection"
                        )}
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={updateSmtpMutation.isPending || isLoadingSmtp}
                        data-testid="button-save-smtp"
                      >
                        {updateSmtpMutation.isPending ? "Saving..." : "Save Email Settings"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Preferences
                  </CardTitle>
                  <CardDescription>Configure your personal AI settings and API key.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Your Personal AI Key:</strong> When configured, your OpenAI API key will be used for all AI features instead of the platform's shared key. This gives you more control over usage and costs.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Personal AI Key</Label>
                        <p className="text-sm text-muted-foreground">Use your own OpenAI API key for AI features</p>
                      </div>
                      <Switch 
                        checked={aiSettings.isEnabled}
                        onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, isEnabled: checked }))}
                        data-testid="switch-ai-enabled"
                      />
                    </div>
                    
                    {aiSettings.isEnabled && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Label htmlFor="openaiApiKey" className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            OpenAI API Key
                          </Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                id="openaiApiKey"
                                type={showApiKey ? "text" : "password"}
                                value={aiSettings.openaiApiKey}
                                onChange={(e) => setAiSettings(prev => ({ ...prev, openaiApiKey: e.target.value }))}
                                placeholder={userAiSettings?.hasKey ? "••••••••••••" : "sk-..."}
                                data-testid="input-user-openai-key"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                onClick={() => setShowApiKey(!showApiKey)}
                                data-testid="button-toggle-key-visibility"
                              >
                                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          {userAiSettings?.hasKey && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              API key configured: {userAiSettings.maskedKey}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenAI's dashboard</a>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <Button
                    onClick={() => {
                      updateAiSettingsMutation.mutate({
                        apiKey: aiSettings.openaiApiKey || undefined,
                        isEnabled: aiSettings.isEnabled,
                        provider: aiSettings.provider,
                      });
                    }}
                    disabled={updateAiSettingsMutation.isPending || isLoadingAi}
                    data-testid="button-save-ai-settings"
                  >
                    {updateAiSettingsMutation.isPending ? "Saving..." : "Save AI Settings"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure how you receive alerts and updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive daily digests of your activity.</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-email-notifications" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">New Lead Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when a new lead is assigned to you.</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-lead-alerts" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications for due tasks.</p>
                    </div>
                    <Switch data-testid="switch-task-reminders" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Deal Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified when deal stages change.</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-deal-updates" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
