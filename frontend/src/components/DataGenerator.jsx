import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import axios from "../lib/axios";

const DataGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(10);
  const [type, setType] = useState("all");

  const generateData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/ai/generate-sample-data", {
        type,
        count: parseInt(count),
      });

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error generating data:", error);
      toast.error("Failed to generate sample data");
    } finally {
      setLoading(false);
    }
  };

  const dataTypes = [
    { value: "all", label: "All Data Types" },
    { value: "jobs", label: "Job Postings" },
    { value: "users", label: "User Profiles" },
    { value: "applications", label: "Job Applications" },
    { value: "companies", label: "Company Profiles" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Generator</h1>
        <p className="text-gray-600">
          Generate sample data for testing and development using AI
        </p>
      </div>

      <div className="max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Generate Sample Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Data Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((dataType) => (
                    <SelectItem key={dataType.value} value={dataType.value}>
                      {dataType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="count">Count</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Number of items to generate"
              />
            </div>

            <Button
              onClick={generateData}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Data"}
            </Button>

            <div className="text-sm text-gray-500">
              <p>• This will generate realistic sample data using AI</p>
              <p>• Data includes jobs, users, applications, and companies</p>
              <p>• Use for testing and development purposes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataGenerator;
