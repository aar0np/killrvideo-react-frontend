
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useModerationFlags, useActionFlag } from '@/hooks/useApi';
import { FlagResponse } from '@/types/api';
import { Flag, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

export default function Moderation() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: flagsData, isLoading } = useModerationFlags(statusFilter === 'all' ? undefined : statusFilter);
  const actionFlagMutation = useActionFlag();

  const handleFlagAction = async (flagId: string, status: string, moderatorNotes?: string) => {
    try {
      await actionFlagMutation.mutateAsync({ flagId, status, moderatorNotes });
      toast.success(`Flag ${status} successfully`);
    } catch (error: any) {
      toast.error(error.detail || 'Failed to update flag');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">Loading moderation dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Moderation Dashboard</h1>
          <p className="text-muted-foreground">Manage content flags and user reports</p>
        </div>

        <Tabs defaultValue="flags" className="space-y-6">
          <TabsList>
            <TabsTrigger value="flags">Content Flags</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="flags" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6">
              {(flagsData as any)?.data?.map((flag: FlagResponse) => (
                <Card key={flag.flagId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(flag.status)}
                        <span className="capitalize">{flag.contentType} Flag</span>
                      </CardTitle>
                      <Badge className={getStatusColor(flag.status)}>
                        {flag.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      Reason: {flag.reasonCode} • Reported {new Date(flag.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Content ID: {flag.contentId}</p>
                      {flag.reasonText && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Additional details: {flag.reasonText}
                        </p>
                      )}
                    </div>

                    {flag.moderatorNotes && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium">Moderator Notes:</p>
                        <p className="text-sm text-muted-foreground">{flag.moderatorNotes}</p>
                      </div>
                    )}

                    {flag.status === 'open' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleFlagAction(flag.flagId, 'under_review')}
                          disabled={actionFlagMutation.isPending}
                        >
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleFlagAction(flag.flagId, 'approved', 'Content removed for policy violation')}
                          disabled={actionFlagMutation.isPending}
                        >
                          Approve & Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFlagAction(flag.flagId, 'rejected', 'No policy violation found')}
                          disabled={actionFlagMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    <Button asChild variant="outline" size="sm">
                      <Link to={`/moderation/flags/${flag.flagId}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {(flagsData as any)?.data?.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No flags found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Search and manage user accounts and moderator roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/moderation/users">Manage Users</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
