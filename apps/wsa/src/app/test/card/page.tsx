import React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import { GeneralCard } from "@acme/ui/general/GeneralCard";

function CardPage() {
  return (
    <div>
      <GeneralCard
        title="Card Title"
        subtitle="Card Description"
        content="Card Content"
        image={{ src: "https://picsum.photos/800/400", alt: "Card Image" }}
      />
    </div>
  );
}

export default CardPage;
