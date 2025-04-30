import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    skills: user?.skills || [],
    hourlyRate: user?.hourlyRate || "",
    availability: user?.availability || "",
    location: user?.location || "",
    website: user?.website || "",
    socialLinks: user?.socialLinks || {
      github: "",
      linkedin: "",
      twitter: "",
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get("/api/users/profile");
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put("/api/users/profile", data);
      return response.data;
    },
    onSuccess: () => {
      setIsEditing(false);
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter skills separated by commas"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location and Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location and Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GitHub
                </label>
                <input
                  type="url"
                  name="social.github"
                  value={formData.socialLinks.github}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="social.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <input
                  type="url"
                  name="social.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                disabled={updateProfileMutation.isLoading}
              >
                {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
