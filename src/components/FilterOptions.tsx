"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, FileType, Globe, SlidersHorizontal } from "lucide-react";

export function FilterOptions() {
  const [fileType, setFileType] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  return (
    <div className="p-4 mt-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <div className="flex flex-wrap gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            <h3 className="font-medium">Advanced Filters</h3>
          </div>
          <Separator className="mb-4" />
        </div>

        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <div className="flex items-center gap-2 mb-2">
            <FileType className="h-4 w-4 text-zinc-500" />
            <Label htmlFor="fileType">File Type</Label>
          </div>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger id="fileType">
              <SelectValue placeholder="Any file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any file type</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">DOC/DOCX</SelectItem>
              <SelectItem value="xls">XLS/XLSX</SelectItem>
              <SelectItem value="ppt">PPT/PPTX</SelectItem>
              <SelectItem value="txt">TXT</SelectItem>
              <SelectItem value="code">Code files</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-zinc-500" />
            <Label htmlFor="timeRange">Time Range</Label>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger id="timeRange">
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="day">Past 24 hours</SelectItem>
              <SelectItem value="week">Past week</SelectItem>
              <SelectItem value="month">Past month</SelectItem>
              <SelectItem value="year">Past year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {timeRange === "custom" && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="mb-2 block">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  id="startDate"
                  type="date"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="endDate" className="mb-2 block">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  id="endDate"
                  type="date"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )}

        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-zinc-500" />
            <Label htmlFor="region">Region</Label>
          </div>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Any region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any region</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[calc(50%-0.5rem)]">
          <div className="flex items-center gap-2 mb-2">
            <Label>Additional Options</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="exactMatch" />
              <Label htmlFor="exactMatch" className="text-sm">Exact phrase match</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="excludeResults" />
              <Label htmlFor="excludeResults" className="text-sm">Exclude adult content</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeRelated" />
              <Label htmlFor="includeRelated" className="text-sm">Include related searches</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
