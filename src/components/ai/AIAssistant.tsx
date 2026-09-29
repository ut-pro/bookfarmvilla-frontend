"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Bot,
  LocateFixed,
  MapPin,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import AIPropertyCard, { AIProperty } from "./AIPropertyCard";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ApiResponse = {
  message: string;
  properties: AIProperty[];
  vendors: unknown[];
  requirements?: {
    location?: string | null;
    guests?: number | null;
    budget?: number | null;
    propertyType?: string | null;
    amenities?: string[];
  };
  locationSupported?: boolean;
  locationMessage?: string | null;
};

const API_BASE_URL =
  process.env.BACKEND_API_URL ??
  "https://book-farm-villa-be.onrender.com";

const quickActions = [
  "Pool farmhouse",
  "Birthday party",
  "Under ₹15k",
  "Family stay",
  "Near me",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 Main BookFarmVilla AI hoon. Aap location, guests, budget aur requirements bataiye — main verified listings ke basis par options suggest karunga.",
    },
  ]);
  const [properties, setProperties] = useState<AIProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const requestLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          setLocationError(null);
          resolve(coords);
        },
        () => {
          setLocationError("Please allow location access, or search by city/area.");
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
      );
    });
  };

  const sendMessage = async (messageOverride?: string, locationOverride?: { latitude: number; longitude: number } | null) => {
    const message = (messageOverride ?? input).trim();
    if (!message || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    let coords = locationOverride ?? location;
    if (/near me|mere paas|mere pass|aas paas|nearby|around me/i.test(message) && !coords) {
      coords = await requestLocation();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: nextMessages.slice(-8),
          latitude: coords?.latitude ?? null,
          longitude: coords?.longitude ?? null,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("AI is getting many requests right now. Please try again in a moment.");
        }
        throw new Error("AI assistant is temporarily unavailable.");
      }

      const data: ApiResponse = await response.json();
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.message },
      ]);
      setProperties(data.properties ?? []);

      if (data.locationMessage) {
        setLocationError(data.locationMessage);
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, I could not process that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  return (
    <>
      {/* Floating Ask AI launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-full bg-[#2EAD45] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-green-900/20 transition-all hover:-translate-y-0.5 hover:bg-[#1E8A32] sm:bottom-6 sm:right-6"
          aria-label="Open BookFarmVilla AI assistant"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
            <Sparkles size={17} />
          </span>
          <span>Ask AI</span>
        </button>
      )}

      {/* Chat */}
      {open && (
        <section
          className="fixed inset-x-0 bottom-0 z-[80] flex h-[min(760px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-t-3xl border border-gray-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[680px] sm:w-[410px] sm:rounded-3xl"
          aria-label="BookFarmVilla AI chat"
        >
          <header className="flex items-center justify-between bg-[#2EAD45] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
                <Bot size={21} />
              </div>
              <div>
                <p className="text-sm font-bold">BookFarmVilla AI</p>
                <p className="text-[11px] text-white/80">Verified property assistant</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 hover:bg-white/10"
              aria-label="Close AI chat"
            >
              <X size={19} />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] p-3.5">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-md bg-[#2EAD45] text-white"
                        : "rounded-bl-md border border-gray-100 bg-white text-[#0F172A] shadow-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-xs text-gray-500 shadow-sm">
                    AI is checking verified listings…
                  </div>
                </div>
              )}

              {properties.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <p className="px-1 text-xs font-semibold uppercase tracking-wider text-[#2EAD45]">
                    Matching properties
                  </p>
                  {properties.map((property) => (
                    <AIPropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>

            {locationError && (
              <div className="border-t border-amber-100 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <span>{locationError}</span>
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 bg-white p-3">
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => {
                      if (action === "Near me") {
                        void (async () => {
                          const coords = await requestLocation();
                          if (coords) {
                            void sendMessage("Farmhouses near me", coords);
                          }
                        })();
                        return;
                      }
                      void sendMessage(action);
                    }}
                    className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:border-[#2EAD45] hover:text-[#1E8A32]"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => { void requestLocation(); }}
                  className="mb-0.5 rounded-xl border border-gray-200 p-3 text-gray-500 hover:border-[#2EAD45] hover:text-[#2EAD45]"
                  aria-label="Use my location"
                  title="Use my location"
                >
                  <LocateFixed size={17} />
                </button>

                <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-gray-200 bg-gray-50 px-3 focus-within:border-[#2EAD45] focus-within:ring-2 focus-within:ring-green-100">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask about farmhouse, villa..."
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#0F172A] outline-none placeholder:text-gray-400"
                    maxLength={1200}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSend}
                  className="mb-0.5 rounded-xl bg-[#2EAD45] p-3 text-white transition-colors hover:bg-[#1E8A32] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </form>

              <p className="mt-2 text-center text-[9px] text-gray-400">
                Suggestions are based on verified BookFarmVilla listing data.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
