import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
        } else {
          setProfile(profileData);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const createProfile = async () => {
    if (!user) return;
    
    try {
      // The trigger will automatically create the profile when a user signs up
      // This is just a fallback in case it didn't work
      const { data, error } = await supabase.rpc('generate_username');
      
      if (error) throw error;
      
      const username = data || `User${user.id.substring(0, 8)}`;
      
      const { data: profileData, error: insertError } = await supabase
        .from('profiles')
        .insert([{ user_id: user.id, username }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      setProfile(profileData);
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">No profile found for your account.</p>
            <Button onClick={createProfile} className="w-full">
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  value={user.email || ''} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value="••••••••" 
                  readOnly 
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  value={profile.username} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Account created: {new Date(profile.created_at).toLocaleDateString()}</p>
                <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;