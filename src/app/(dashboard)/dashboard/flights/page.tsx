"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { Plane, Calendar, MapPin, Loader2, AlertCircle, Clock, Users } from "lucide-react";

interface FlightOffer {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  carrier: string;
  carrierCode: string;
  flightNumber: string;
  price: number;
  currency: string;
  numberOfStops: number;
  travelClass: string;
  availableSeats: number;
}

export default function FlightsPage() {
  const { user } = useAuth();
  const [origin, setOrigin] = useState("LAX");
  const [destination, setDestination] = useState("JFK");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [results, setResults] = useState<FlightOffer[]>([]);
  const [searching, setSearching] = useState(false);
  const [booking, setBooking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const formatDuration = (duration: string) => {
    // Convert PT4H30M to "4h 30m"
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;

    const hours = match[1] ? match[1].replace("H", "h ") : "";
    const minutes = match[2] ? match[2].replace("M", "m") : "";
    return (hours + minutes).trim() || duration;
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSearch = async () => {
    if (!origin || !destination || !date) {
      setError("Please fill in all search fields");
      return;
    }

    if (origin.length !== 3 || destination.length !== 3) {
      setError("Airport codes must be 3 letters (e.g., LAX, JFK)");
      return;
    }

    setSearching(true);
    setError(null);
    setResults([]);

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const params = new URLSearchParams({
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        date,
        adults: "1",
        class: "ECONOMY",
        max: "10",
      });

      const response = await fetch(`/api/flights/search?${params}`, { headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search flights");
      }

      const data = await response.json();
      setResults(data.data || []);
      setUsingMockData(data.usingMockData || false);
    } catch (err: any) {
      console.error("Flight search error:", err);
      setError(err.message || "Failed to search flights. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleBook = async (flight: FlightOffer) => {
    if (!user?.id) {
      alert("Please log in to book flights");
      return;
    }

    setBooking(flight.id);

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/flights/book", {
        method: "POST",
        headers,
        body: JSON.stringify({
          flightId: flight.id,
          price: flight.price,
          origin: flight.origin,
          destination: flight.destination,
          departureTime: flight.departureTime,
          carrier: flight.carrier,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book flight");
      }

      const data = await response.json();

      alert(
        `Flight booked successfully!\n\n` +
          `Route: ${flight.origin} → ${flight.destination}\n` +
          `Flight: ${flight.carrier} ${flight.flightNumber}\n` +
          `Base Price: $${flight.price.toFixed(2)}\n` +
          `Platform Fee (1.8%): $${data.data.platformFee.toFixed(2)}\n` +
          `Total: $${data.data.totalAmount.toFixed(2)}\n\n` +
          `Status: Pending confirmation\n` +
          `Transaction ID: ${data.data.transactionId}`
      );

      // Optionally refresh results or navigate to transactions
    } catch (err: any) {
      console.error("Flight booking error:", err);
      alert(`Failed to book flight: ${err.message}`);
    } finally {
      setBooking(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Flight Booking</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search and book flights with real-time pricing
        </p>
      </div>

      {usingMockData && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-600 text-sm">Using Mock Data</p>
            <p className="text-xs text-amber-600/80 mt-1">
              Amadeus API is not configured. Showing sample flight data. Configure AMADEUS_API_KEY
              and AMADEUS_API_SECRET in server environment to enable live flight search.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search Form */}
        <Card variant="glass" padding="lg" hover="lift" className="lg:col-span-1">
          <CardHeader className="p-0 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Plane className="h-4 w-4" />
              Flight Search
            </div>
            <CardTitle className="text-lg">Search Flights</CardTitle>
            <CardDescription>Enter flight details to search available options</CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Origin (IATA Code)</Label>
              <Input
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                placeholder="LAX"
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">3-letter airport code</p>
            </div>

            <div className="space-y-2">
              <Label>Destination (IATA Code)</Label>
              <Input
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                placeholder="JFK"
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">3-letter airport code</p>
            </div>

            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button className="w-full gap-2" onClick={handleSearch} disabled={searching}>
              {searching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Plane className="h-4 w-4" />
                  Search Flights
                </>
              )}
            </Button>

            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs space-y-1">
              <p className="font-medium text-blue-600">Booking Fee</p>
              <p className="text-blue-600/80">
                A 1.8% platform fee is added to all flight bookings for payment processing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card variant="glass" padding="lg" hover="lift" className="lg:col-span-2">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg">
              Flight Results {results.length > 0 && `(${results.length})`}
            </CardTitle>
            <CardDescription>
              {results.length === 0
                ? "Search for flights to see available options"
                : `Showing flights from ${origin} to ${destination}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-3">
            {results.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center">
                <Plane className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Enter your travel details and click "Search Flights" to see available options
                </p>
              </div>
            ) : (
              results.map((flight) => (
                <div
                  key={flight.id}
                  className="flex flex-col gap-4 rounded-lg border border-border px-4 py-4 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent-500" />
                        <span className="font-semibold">
                          {flight.origin} → {flight.destination}
                        </span>
                        {flight.numberOfStops === 0 && (
                          <Badge variant="success" className="text-xs">
                            Non-stop
                          </Badge>
                        )}
                        {flight.numberOfStops > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {flight.numberOfStops} stop{flight.numberOfStops > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(flight.departureTime)}
                        </div>
                        <span>→</span>
                        <div>{formatDateTime(flight.arrivalTime)}</div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <Badge variant="outline">{flight.carrier}</Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(flight.duration)}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {flight.availableSeats} seats
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="text-2xl font-bold text-accent-600">
                          ${flight.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">+ 1.8% fee</p>
                      </div>
                      <Button
                        onClick={() => handleBook(flight)}
                        disabled={booking === flight.id}
                        className="w-full"
                      >
                        {booking === flight.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Booking...
                          </>
                        ) : (
                          "Book Flight"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
