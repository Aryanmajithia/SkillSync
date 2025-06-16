import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileService";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    skills: [],
    hourlyRate: "",
    availability: "",
    location: "",
    website: "",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
    enabled: !!user,
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        hourlyRate: profile.hourlyRate || "",
        availability: profile.availability || "",
        location: profile.location || "",
        website: profile.website || "",
        socialLinks: profile.socialLinks || {
          github: "",
          linkedin: "",
          twitter: "",
        },
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => profileService.updateProfile(data),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries(["profile"]);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const platform = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSkillsChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      skills: value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const handleAvailabilityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      availability: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Professional Information
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  type="text"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="Enter skills separated by commas"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={formData.availability}
                    onValueChange={handleAvailabilityChange}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Location and Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location and Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  name="social.github"
                  value={formData.socialLinks.github}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  name="social.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  type="url"
                  name="social.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button type="submit" disabled={updateProfileMutation.isLoading}>
                {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
