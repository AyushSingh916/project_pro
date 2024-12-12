import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type Collaborator = {
  id: number;
  username: string;
  email: string;
};

export default function Collaborators({
    collabarators,
}: {
    collabarators: Collaborator[];
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          {collabarators.length > 0 ? (
            <ul className="space-y-2">
              {collabarators.map((collaborator) => (
                <li
                  key={collaborator.username}
                  className="px-4 py-2 border rounded-md shadow-sm"
                >
                  <p className="font-semibold">{collaborator.username}</p>
                  <p className="text-sm text-gray-500">{collaborator.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No collaborators found.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
