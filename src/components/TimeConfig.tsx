import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TimeConfig = () => {
  const [timeUnits, setTimeUnits] = useState({
    secondsPerMinute: 60,
    minutesPerHour: 60,
    hoursPerDay: 24,
    daysPerWeek: 7,
    weeksPerMonth: 4,
    monthsPerYear: 12,
  });

  // Add state for the converter dropdowns
  const [fromUnit, setFromUnit] = useState("day");
  const [toUnit, setToUnit] = useState("hours");

  const timeUnitOptions = [
    { value: "second", label: "Second" },
    { value: "minute", label: "Minute" },
    { value: "hour", label: "Hour" },
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  // Calculate derived values
  const calculations = useMemo(() => {
    const secondsPerHour =
      timeUnits.secondsPerMinute * timeUnits.minutesPerHour;
    const secondsPerDay = secondsPerHour * timeUnits.hoursPerDay;
    const secondsPerWeek = secondsPerDay * timeUnits.daysPerWeek;
    const secondsPerMonth = secondsPerWeek * timeUnits.weeksPerMonth;
    const secondsPerYear = secondsPerMonth * timeUnits.monthsPerYear;

    // Create conversion map
    const conversions = {
      second: 1,
      minute: timeUnits.secondsPerMinute,
      hour: secondsPerHour,
      day: secondsPerDay,
      week: secondsPerWeek,
      month: secondsPerMonth,
      year: secondsPerYear,
    };

    const standardSecondsPerYear = 60 * 60 * 24 * 365.25;
    const timeRatio = secondsPerYear / standardSecondsPerYear;

    return {
      secondsPerHour,
      secondsPerDay,
      secondsPerWeek,
      secondsPerMonth,
      secondsPerYear,
      timeRatio,
      conversions,
    };
  }, [timeUnits]);

  // Calculate conversion between selected units
  const conversion = useMemo(() => {
    const fromSeconds = calculations.conversions[fromUnit];
    const toSeconds = calculations.conversions[toUnit];
    return fromSeconds / toSeconds;
  }, [calculations, fromUnit, toUnit]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const numValue = Math.max(Number(value) || 1, 1);
    setTimeUnits((prev) => ({ ...prev, [id]: numValue }));
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Previous cards remain the same */}
      <div>
        <h1 className="text-2xl font-bold mb-2">What If Time</h1>
        <p className="text-gray-700">
          Explore how time would work with different fundamental units. Adjust
          the values below to create your own time system and see how it
          compares to standard time.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(timeUnits).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <Label htmlFor={key} className="font-medium">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <Input
                  id={key}
                  type="number"
                  value={value}
                  min="1"
                  autoComplete="off"
                  onChange={handleChange}
                  className="w-24"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New converter card */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Time Unit Converter</h2>
          <div className="flex items-center gap-2">
            <p>By your rules, one</p>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeUnitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p>equals</p>
            <span className="font-bold">{conversion.toLocaleString()}</span>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeUnitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">
            Understanding Your Time System
          </h2>
          <div className="prose space-y-4">
            <p>
              In your custom time system, time flows differently from what we're
              used to. A minute takes {timeUnits.secondsPerMinute} heartbeats
              (seconds), and you'd need to count to{" "}
              {calculations.secondsPerHour.toLocaleString()} to measure a full
              hour. Each day contains {timeUnits.hoursPerDay} hours, making it
              {timeUnits.hoursPerDay > 24 ? " longer" : " shorter"} than an
              Earth day.
            </p>

            <p>
              Some interesting facts about your time system:
              {timeUnits.hoursPerDay !== 24 && (
                <>
                  <br />• Your day is {Math.abs(timeUnits.hoursPerDay - 24)}{" "}
                  hours
                  {timeUnits.hoursPerDay > 24 ? " longer" : " shorter"} than
                  Earth's day
                </>
              )}
              {timeUnits.daysPerWeek !== 7 && (
                <>
                  <br />• Your week has {Math.abs(timeUnits.daysPerWeek - 7)}{" "}
                  days
                  {timeUnits.daysPerWeek > 7 ? " more" : " fewer"} than a
                  standard week
                </>
              )}
              <br />• A school lesson (45 minutes) would last{" "}
              {Math.round((45 * timeUnits.secondsPerMinute) / 60)} standard
              minutes
              <br />• A quick power nap (20 minutes) would be{" "}
              {Math.round((20 * timeUnits.secondsPerMinute) / 60)} standard
              minutes
              <br />• A marathon runner (finishing in 4 hours) would take{" "}
              {Math.round(4 * calculations.timeRatio)} hours in your time
            </p>

            <p>
              Your calendar would look quite different too - each month has{" "}
              {timeUnits.weeksPerMonth} weeks, making it{" "}
              {timeUnits.weeksPerMonth * timeUnits.daysPerWeek} days long. A
              full year in your system has {timeUnits.monthsPerYear} months, or{" "}
              {timeUnits.monthsPerYear * timeUnits.weeksPerMonth} weeks total.
            </p>

            <p>
              Compared to Earth time, your year is{" "}
              {calculations.timeRatio < 1 ? "shorter" : "longer"} by a factor of{" "}
              {Math.abs(calculations.timeRatio - 1).toFixed(2)}. This means time
              in your system flows{" "}
              {calculations.timeRatio < 1 ? "faster" : "slower"} - for every
              Earth year that passes,
              {calculations.timeRatio < 1
                ? ` ${(1 / calculations.timeRatio).toFixed(2)} years `
                : ` ${calculations.timeRatio.toFixed(2)} years `}
              would pass in your system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeConfig;
