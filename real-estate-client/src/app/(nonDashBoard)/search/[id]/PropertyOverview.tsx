import { useGetpropertiesQuery } from "@/state/api";
import React from "react";

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
  const { data: propery, isError, isLoading } = useGetpropertyQuery(propertyId);
  return <div></div>;
};

export default PropertyOverview;
