import { redirect } from "react-router";
import { createAnimal } from "~/models/animal.server";
import type { Route } from "./+types/animals";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const common_name = String(formData.get("common_name"));
  const scientific_name = formData.get("scientific_name")
    ? String(formData.get("scientific_name"))
    : undefined;
  const taxonomic_group = String(formData.get("taxonomic_group"));
  const native_region = String(formData.get("native_region"));
  const conservation_status = String(formData.get("conservation_status"));
  const threatsRaw = formData.get("threats");
  const threats = threatsRaw
    ? String(threatsRaw)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  const photo_url = formData.get("photo_url")
    ? String(formData.get("photo_url"))
    : undefined;
  const fun_fact = formData.get("fun_fact")
    ? String(formData.get("fun_fact"))
    : undefined;
  const facility_context = formData.get("facility_context")
    ? String(formData.get("facility_context"))
    : undefined;

  const newId = createAnimal({
    common_name,
    scientific_name,
    taxonomic_group,
    native_region,
    conservation_status,
    threats,
    photo_url,
    fun_fact,
    facility_context,
  });

  return redirect(`/animals/${newId}`);
}

export default function AddAnimal() {
  return (
    <main>
      <h1>Add Animal</h1>
      <form method="post">
        <div>
          <label htmlFor="common_name">Common Name *</label>
          <input id="common_name" name="common_name" type="text" required />
        </div>

        <div>
          <label htmlFor="scientific_name">Scientific Name</label>
          <input id="scientific_name" name="scientific_name" type="text" />
        </div>

        <div>
          <label htmlFor="taxonomic_group">Taxonomic Group *</label>
          <select id="taxonomic_group" name="taxonomic_group" required>
            <option value="">-- Select --</option>
            <option value="fish">Fish</option>
            <option value="reptile">Reptile</option>
            <option value="amphibian">Amphibian</option>
            <option value="mammal">Mammal</option>
            <option value="bird">Bird</option>
          </select>
        </div>

        <div>
          <label htmlFor="native_region">Native Region *</label>
          <input id="native_region" name="native_region" type="text" required />
        </div>

        <div>
          <label htmlFor="conservation_status">Conservation Status *</label>
          <select id="conservation_status" name="conservation_status" required>
            <option value="">-- Select --</option>
            <option value="Least Concern">Least Concern</option>
            <option value="Near Threatened">Near Threatened</option>
            <option value="Vulnerable">Vulnerable</option>
            <option value="Endangered">Endangered</option>
            <option value="Critically Endangered">Critically Endangered</option>
          </select>
        </div>

        <div>
          <label htmlFor="threats">
            Threats <span>(comma-separated)</span>
          </label>
          <input
            id="threats"
            name="threats"
            type="text"
            placeholder="e.g. habitat loss, poaching"
          />
        </div>

        <div>
          <label htmlFor="photo_url">Photo URL</label>
          <input id="photo_url" name="photo_url" type="text" />
        </div>

        <div>
          <label htmlFor="fun_fact">Fun Fact</label>
          <textarea id="fun_fact" name="fun_fact" />
        </div>

        <div>
          <label htmlFor="facility_context">Facility Context</label>
          <textarea id="facility_context" name="facility_context" />
        </div>

        <button type="submit">Add Animal</button>
      </form>
    </main>
  );
}