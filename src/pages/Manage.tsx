import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, MoreHorizontal, Search, Hammer, List, Wrench, Book, User, Pencil, Cross, Delete, Save } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

const Manage = () => {
  const [open, setOpen] = React.useState(false);
  // const [manage, setManage] = useState([]);
  const [artisans, setArtisans]: any = useState([
    { id: 1, name: 'Pottery', color: '#f00' },
    { id: 2, name: 'Weaving', color: '#f00' },
  ]);
  const [crafts, setCrafts] = useState([
    { id: 1, name: 'Pottery', color: '#f00' },
    { id: 2, name: 'Weaving', color: '#f00' },
  ]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Home Decor', color: '#f00', craft_name: '' },
    { id: 2, name: 'Textiles', color: '#f00', craft_name: '' },
  ]);
  const [techniqueSkills, setTechniqueSkills] = useState([
    { id: 1, name: 'Handmade', color: '#f00', category_name: '', craft_name: '' },
    { id: 2, name: 'Digital Design', color: '#f00', category_name: '', craft_name: '' },
  ]);
  const [education, setEducation] = useState([
    { id: 1, name: 'Bachelors', color: '#f00' },
    { id: 2, name: 'Masters', color: '#f00' },
  ]);
  const [users, setUsers] = useState([
    { id: 1, username: 'John Doe', color: '#f00' },
    { id: 2, username: 'Jane Smith', color: '#0f0' },
  ]);
  const tables = [
    'crafts',
    'categories',
    'techniques',
    'users',
  ]
  const [activeTab, setActiveTab] = useState('Craft');
  useEffect(() => {
    const fetchData = async () => {
      try {
        for (const tableName of tables) {
          const response = await fetch(`http://13.239.184.38:6500/${tableName}`);
          const data = await response.json();
          switch (tableName) {
            case 'artisans':
              setArtisans(data);
              break;
            case 'education':
              setEducation(data);
              break;
            case 'crafts':
              setCrafts(data);
              break;
            case 'categories':
              setCategories(data);
              break;
            case 'techniques':
              setTechniqueSkills(data);
              break;
            case 'users':
              setUsers(data);
              break;
            default:
              console.warn(`Unknown table name: ${tableName}`);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Layout>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >

          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="artisans" className="w-100">
              <TabsList className="justify-between flex items-center">
                <TabsTrigger value="Craft" className="flex-1 items-center gap-1.5" onClick={() => setActiveTab('Craft')}>
                  <Hammer className="h-4 w-4" />
                  Crafts
                </TabsTrigger>
                <TabsTrigger value="Category" className="flex-1 items-center gap-1.5" onClick={() => setActiveTab('Category')}>
                  <List className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="Technique/Skills" className="flex-1 items-center gap-1.5" onClick={() => setActiveTab('Technique/Skills')}>
                  <Wrench className="h-4 w-4" />
                  Technique/Skills
                </TabsTrigger>
                {/*    <TabsTrigger value="Education" className="flex-1 items-center gap-1.5" onClick={() => setActiveTab('Education')}>
                  <Book className="h-4 w-4" />
                  Education
                </TabsTrigger> */}
                <TabsTrigger value="User" className="flex-1 items-center gap-1.5" onClick={() => setActiveTab('User')}>
                  <User className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-.5 ml-auto">
                      <Plus className="h-4 w-4" />
                      <span>{activeTab}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New {activeTab}</DialogTitle>
                      <DialogDescription>
                        <form>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="name" className="text-right">
                                Name
                              </label>
                              <Input id="name" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="color" className="text-right">
                                Color
                              </label>
                              <Input type="color" id="color" className="col-span-3 h-10 w-full" />
                            </div>
                          </div>
                        </form>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className="gap-1.5">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                      <Button className="gap-1.5">
                        <span>Cancel</span>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsList>
              <TabsContent value="Craft">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {crafts.map((craft) => (
                              <TableRow key={craft.id} className="cursor-pointer" style={{ color: craft.color }}>
                                <TableCell className="font-medium">{craft.name}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Edit Craft</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">
                                        Delete Craft
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="Category">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Craft</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categories.map((category) => (
                              <TableRow key={category.id} className="cursor-pointer" style={{ color: category.color }}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell className="font-medium">{category.craft_name}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Edit Category</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">
                                        Delete Category
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              <TabsContent value="Technique/Skills">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Technique/Skills</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Craft</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {techniqueSkills.map((skill) => (
                              <TableRow key={skill.id} className="cursor-pointer" style={{ color: skill.color }}>
                                <TableCell className="font-medium">{skill.name}</TableCell>
                                <TableCell className="font-medium">{skill.category_name}</TableCell>
                                <TableCell className="font-medium">{skill.craft_name}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Edit Skill</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">
                                        Delete Skill
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              {/* <TabsContent value="Education">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {education.map((edu) => (
                              <TableRow key={edu.id} className="cursor-pointer bg-card">
                                <TableCell className="font-medium">{edu.name}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>Edit Education</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive">
                                        Delete Education
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent> */}
              <TabsContent value="User">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id} className="cursor-pointer" style={{ color: user.color }}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem><Pencil className="h-4 w-4 me-1" /> Edit</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive"><Delete className="h-4 w-4 me-1" />Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </Layout>
      </motion.div>
    </>
  );
};

export default Manage;

export { Manage };
