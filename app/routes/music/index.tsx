import { PageLayout } from "~/components/main/PageLayout";

function computeAge(birthdate: Date) {
  const diff_ms = Date.now() - birthdate.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

export default function About() {
  return (
    <PageLayout>
      <main>
        <p>
          Here I present some personal favorites of the songs I created. There
          are many more available on Spotify or Soundcloud.
        </p>

        <p>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/track/3W0Dil6itcc5lGWBtsJPc9?utm_source=generator&theme=0"
            width="100%"
            height="352"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </p>

        <p>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/track/0x1IZgpIN2T3r0gk3LRgMW?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </p>

        <p>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/track/45rklRf10XcCKqbQuKg48n?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </p>

        <p>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/track/58cPmAwTenjPUTLw9ZBsCp?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </p>
      </main>
    </PageLayout>
  );
}
