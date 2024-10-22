// CodeAttribution.tsx

import React, { useState } from "react";
import { Code } from "lucide-react";
import { CONTRACT_ADDRESS } from "@/utils/contract";

const CodeAttribution: React.FC = () => {
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const embedCode = `
<div id="gitsplits-donate"></div>
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/ethers@5.0.0/dist/ethers.umd.min.js"></script>
<script src="https://example.com/path-to-your-embed-script.js"></script>
<script>
  GitSplitsDonate.render({
    contractAddress: '${CONTRACT_ADDRESS}',
    containerElementId: 'gitsplits-donate'
  });
</script>
`;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Code className="mr-2" /> Embed Donation Widget
      </h2>
      <button
        onClick={() => setShowEmbedCode(!showEmbedCode)}
        className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 mb-4"
      >
        {showEmbedCode ? "Hide Embed Code" : "Show Embed Code"}
      </button>
      {showEmbedCode && (
        <div className="relative">
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{embedCode}</code>
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(embedCode)}
            className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeAttribution;
