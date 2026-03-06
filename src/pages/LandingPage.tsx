import { PublicLayout } from '@/components/layouts/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { FileText, Search, Brain, Shield, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: 'Anonymous Reporting',
      description: 'Submit complaints anonymously without revealing your identity. Track your complaint with a unique ID.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes every complaint for sentiment, urgency, and fraud detection automatically.'
    },
    {
      icon: Shield,
      title: 'Fraud Detection',
      description: 'Machine learning algorithms identify suspicious complaints and route them for verification.'
    },
    {
      icon: TrendingUp,
      title: 'Smart Prioritization',
      description: 'Complaints are automatically prioritized based on urgency and impact for faster resolution.'
    },
    {
      icon: Search,
      title: 'Real-time Tracking',
      description: 'Track your complaint status, assigned department, and predicted resolution time.'
    },
    {
      icon: Users,
      title: 'Governance Intelligence',
      description: 'Convert citizen feedback into actionable insights for better governance and policy making.'
    }
  ];

  const categories = [
    { name: 'Road Damage', emoji: '🛣️' },
    { name: 'Water Supply', emoji: '💧' },
    { name: 'Electricity', emoji: '⚡' },
    { name: 'Sanitation', emoji: '🗑️' },
    { name: 'Public Safety', emoji: '🚨' }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Transform Public Complaints into{' '}
              <span className="text-primary">Governance Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered platform enabling citizens to report infrastructure issues anonymously 
              while helping government administrators analyze and resolve complaints efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit">
                <Button size="lg" className="w-full sm:w-auto">
                  Submit a Complaint
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Track Your Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Report Issues Across Categories</h2>
            <p className="text-muted-foreground">We handle complaints across all public infrastructure domains</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Card key={category.name} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <div className="font-medium text-sm">{category.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Artificial Intelligence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform uses cutting-edge AI to analyze complaints, detect fraud, and provide actionable insights
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Simple, transparent, and effective</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold">Submit Complaint</h3>
              <p className="text-muted-foreground">
                Report your issue anonymously with details, location, and optional photo evidence
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes sentiment, detects fraud, assigns priority, and recommends solutions
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold">Track & Resolve</h3>
              <p className="text-muted-foreground">
                Track your complaint status and resolution progress using your unique tracking ID
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <CardContent className="py-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Your voice matters. Report infrastructure issues and help build a better India.
              </p>
              <Link to="/submit">
                <Button size="lg" variant="secondary" className="mt-4">
                  Submit Your First Complaint
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
