import type { Metadata } from "next";
import RoutePlanner from "./route-planner";
import "./travel.css";

export const metadata: Metadata = {
  title: "Travel to Daegu · Business Advisor Korea 2026",
  description: "Plan your trip to Yeungjin University in Daegu by train, bus, or private vehicle.",
};

export default function TravelPage() {
  return <RoutePlanner />;
}
