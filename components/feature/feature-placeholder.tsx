import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeaturePlaceholderProps {
  title: string;
  description: string;
  nextStep: string;
}

export function FeaturePlaceholder({ title, description, nextStep }: FeaturePlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">下一步：{nextStep}</p>
      </CardContent>
    </Card>
  );
}
