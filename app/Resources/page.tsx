"use client";

type Resource = {
  id: number;
  title: string;
  type: "image" | "audio" | "video" | "pdf";
  url: string;
};


export default function RecentResourcesPage() {
  const resources: Resource[] = [
    { id: 1, title: "Satellite Image 1", type: "image", url: "/images/satellite1.jpg" },
    { id: 2, title: "Satellite Image 2", type: "image", url: "/images/satellite2.jpg" },
    { id: 3, title: "Call Recording 1", type: "audio", url: "/audio/call1.mp3" },
    { id: 4, title: "Call Recording 2", type: "audio", url: "/audio/call2.mp3" },
    { id: 5, title: "Suspicious Sound 1", type: "audio", url: "/audio/sound1.mp3" },
    { id: 6, title: "Ambush Video 1", type: "video", url: "/videos/ambush1.mp4" },
    { id: 7, title: "Ambush Video 2", type: "video", url: "/videos/ambush2.mp4" },
    { id: 8, title: "Report 1", type: "pdf", url: "/pdf/report1.pdf" },
    { id: 9, title: "Report 2", type: "pdf", url: "/pdf/report2.pdf" },
  ];

  // Group resources by type
  const groupedResources = resources.reduce((acc: Record<string, Resource[]>, resource) => {
    if (!acc[resource.type]) acc[resource.type] = [];
    acc[resource.type].push(resource);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Recent Resources</h1>

      {Object.keys(groupedResources).map((type) => (
        <div key={type} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 capitalize">{type}s</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groupedResources[type].map((res) => (
              <div
                key={res.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="mb-2 font-semibold">{res.title}</div>

                {/* Preview */}
                {type === "image" && (
                  <img src={res.url} alt={res.title} className="w-full h-40 object-cover rounded" />
                )}
                {type === "video" && (
                  <video controls className="w-full h-40 rounded">
                    <source src={res.url} type="video/mp4" />
                  </video>
                )}
                {type === "audio" && (
                  <audio controls className="w-full">
                    <source src={res.url} type="audio/mpeg" />
                  </audio>
                )}
                {type === "pdf" && (
                  <a
                    href={res.url}
                    target="_blank"
                    className="inline-block mt-2 text-blue-600 underline"
                  >
                    View PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
