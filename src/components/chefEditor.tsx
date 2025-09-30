
// =============================
// File: components/ChefEditor.tsx (reusable editor extracted from the previous canvas)
// Notes: Static-only; no API calls. Accepts mode + initialChef and provides a Save button that only updates local state.
// =============================
"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, Plus, Star, MapPin, PencilLine, Image as ImageIcon, Trash2 } from "lucide-react";

type MenuItem = { title: string; desc: string; price: number };

type Chef = {
  id: string;
  name: string;
  avatar: string;
  cuisine: string[];
  location: string;
  rating: number;
  priceRange: string;
  bio: string;
  gallery: string[];
  menu: MenuItem[];
  dishlocate: string;
  dishes: string[];
};

export default function ChefEditor({ initialChef }: { initialChef: Chef }) {
  const [chef, setChef] = useState<Chef>(initialChef);
  const [bio, setBio] = useState(chef.bio);
  const [name, setName] = useState(chef.name);
  const [location, setLocation] = useState(chef.location);
  const [priceRange, setPriceRange] = useState(chef.priceRange);
  const [cuisines, setCuisines] = useState<string[]>(chef.cuisine);
  const [menuDraft, setMenuDraft] = useState<MenuItem[]>(chef.menu);

  const ratingStars = useMemo(() => {
    const full = Math.floor(chef.rating);
    const half = chef.rating - full >= 0.5;
    return { full, half };
  }, [chef.rating]);

  const money = (n: number) => `$${n.toFixed(0)}`;

  const addCuisine = (c: string) => {
    if (!c) return;
    if (!cuisines.includes(c)) setCuisines([...cuisines, c]);
  };
  const removeCuisine = (c: string) => setCuisines(cuisines.filter((x) => x !== c));

  const addMenuItem = () => setMenuDraft([...menuDraft, { title: "New Dish", desc: "Describe it…", price: 20 }]);
  const updateMenuItem = (idx: number, key: keyof MenuItem, value: string) => {
    const next = [...menuDraft];
    // @ts-ignore
    next[idx][key] = key === "price" ? Number(value) || 0 : value;
    setMenuDraft(next);
  };
  const removeMenuItem = (idx: number) => setMenuDraft(menuDraft.filter((_, i) => i !== idx));

  const saveStatic = () => {
    setChef({ ...chef, bio, name, location, priceRange, cuisine: cuisines, menu: menuDraft });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: Editor */}
      <div className="lg:col-span-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Chef Profile Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Suburb, State" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Price Range</Label>
                      <Input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="$ – $$$$" />
                      <p className="mt-1 text-xs text-muted-foreground">Use $ to $$$$ to indicate typical pricing.</p>
                    </div>
                    <div>
                      <Label>Add Cuisine</Label>
                      <div className="flex gap-2">
                        <Input id="cuisine-input" placeholder="e.g. Taiwanese" onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCuisine((e.target as HTMLInputElement).value.trim());
                            (e.target as HTMLInputElement).value = "";
                          }
                        }} />
                        <button
                          type="button"
                          className="px-3 py-2 rounded-md border"
                          onClick={() => {
                            const el = document.getElementById("cuisine-input") as HTMLInputElement | null;
                            if (el && el.value.trim()) {
                              addCuisine(el.value.trim());
                              el.value = "";
                            }
                          }}
                        >
                          Add
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {cuisines.map((c) => (
                          <Badge key={c} variant="secondary" className="flex items-center gap-2 rounded-full px-3 py-1">
                            {c}
                            <button onClick={() => removeCuisine(c)} className="text-xs opacity-70 hover:opacity-100">×</button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Bio / Story</Label>
                    <Textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Share your story, your cooking style, and what dishes you love to make." />
                    <p className="mt-1 text-xs text-muted-foreground">Tip: mention your signature dishes, regions, and any certifications.</p>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <span className="font-medium">Save</span> 
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="menu" className="mt-6">
                <div className="space-y-4">
                  {menuDraft.map((item, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                      <Card className="border border-dashed">
                        <CardContent className="pt-6">
                          <div className="grid gap-4 md:grid-cols-12">
                            <div className="md:col-span-4">
                              <Label>Dish Title</Label>
                              <Input value={item.title} onChange={(e) => updateMenuItem(idx, "title", e.target.value)} />
                            </div>
                            <div className="md:col-span-6">
                              <Label>Description</Label>
                              <Input value={item.desc} onChange={(e) => updateMenuItem(idx, "desc", e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Price</Label>
                              <Input type="number" value={item.price} onChange={(e) => updateMenuItem(idx, "price", e.target.value)} />
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between">
                            <div className="text-sm text-muted-foreground">Public price: <span className="font-medium">{money(item.price)}</span></div>
                            <button className="p-2 rounded-md hover:bg-muted" onClick={() => removeMenuItem(idx)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  <button type="button" className="px-3 py-2 rounded-md border" onClick={addMenuItem}>+ Add Menu Item</button>
                </div>
              </TabsContent>

              <TabsContent value="photos" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-base">Avatar / Profile Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={chef.avatar} />
                          <AvatarFallback>{chef.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <button className="px-3 py-2 rounded-md border">Upload</button>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Static placeholder upload.</p>
                    </CardContent>
                  </Card>

                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-base">Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-28 items-center justify-center rounded-lg border border-dashed bg-muted/30">
                        <div className="flex flex-col items-center">
                          <ImageIcon className="mb-1 h-5 w-5" />
                          <p className="text-sm">Drag & drop or click</p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Add 3–6 images that show your cooking.</p>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base">Past Dishes (Photos)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {chef.dishes.map((file) => (
                          <div key={file} className="overflow-hidden rounded-xl border bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`${chef.dishlocate}/${file}`} alt={file} className="h-32 w-full object-cover" />
                            <div className="p-2 text-xs text-muted-foreground truncate">{file}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">Static references only.</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right: Live Preview */}
      <div className="space-y-6">
        <Card className="sticky top-6 border-none shadow-md">
          <CardHeader>
            <CardTitle>Public Profile Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={chef.avatar} />
                <AvatarFallback>{chef.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{chef.name}</h3>
                  <span className="text-sm text-muted-foreground">{chef.priceRange}</span>
                </div>
                <div className="text-xs text-muted-foreground">{chef.location}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{chef.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chef.cuisine.map((c) => (
                <Badge key={c} variant="outline" className="rounded-full">{c}</Badge>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="grid gap-3">
              {chef.menu.slice(0, 5).map((m) => (
                <div key={m.title} className="flex items-start justify-between rounded-xl border bg-card p-3">
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </div>
                  <div className="font-semibold">{money(m.price)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
