import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

const ProfileWizard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    title: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
    location: "",
    website: "",
    linkedin: "",
    github: "",
  });

  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const response = await axios.put("/api/users/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      navigate("/profile");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillAdd = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, e.target.value],
      }));
      e.target.value = "";
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const progress = (step / 4) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="mt-2 text-sm text-gray-500">Step {step} of 4</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Basic Information
            </h2>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
            <div>
              <Label htmlFor="skills">Add Skills</Label>
              <Input
                id="skills"
                placeholder="Type a skill and press Enter"
                onKeyDown={handleSkillAdd}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Location & Links
            </h2>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                type="url"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                type="url"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                type="url"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Review & Submit
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">{formData.fullName}</h3>
              <p className="text-gray-600">{formData.title}</p>
              <p className="mt-2 text-gray-700">{formData.bio}</p>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium text-gray-900">
                  Contact Information
                </h4>
                <p className="text-gray-600">{formData.location}</p>
                {formData.website && (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
            >
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              className="ml-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="ml-auto"
              disabled={updateProfile.isLoading}
            >
              {updateProfile.isLoading ? "Saving..." : "Complete Profile"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileWizard;
