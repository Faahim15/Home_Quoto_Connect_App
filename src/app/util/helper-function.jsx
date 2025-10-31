import services from "../components/data/jobs/CategoryIds";
import { specializations } from "../components/data/jobs/CategoryIds";
// Helper functions

export const getServiceName = (serviceId) => {
  const foundService = services.find((service) => service.id === serviceId);
  return foundService ? foundService.name : "Electrician";
};

const getSpecializationTitles = (specIds) => {
  if (!Array.isArray(specIds)) return "No specializations selected";

  return specIds
    .map((id) => {
      const found = specializations.find((spec) => spec.id === id);
      return found ? found.title : id;
    })
    .join(", ");
};

export default getSpecializationTitles;
