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
import { usersApi, companyProfileApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Shield, Building2, Globe, Phone, MapPin, FileText, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const user = getUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-col gap-6 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and company preferences.</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" data-testid="tab-profile">Personal Profile</TabsTrigger>
              <TabsTrigger value="company" data-testid="tab-company">Company Profile</TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your personal details and email settings.</CardDescription>
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
