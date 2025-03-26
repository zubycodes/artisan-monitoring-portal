import React, { useState, useEffect, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, MoreHorizontal, Search, Hammer, List, Wrench, Book, User, Pencil, Cross, Delete, Save, Lock } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';

const API_BASE_URL = 'http://13.239.184.38:6500';

const Manage = () => {
  const [open, setOpen] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [crafts, setCrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesAll, setCategoriesAll] = useState([]);
  const [techniqueSkills, setTechniqueSkills] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [alreadyExistError, setAlreadyExistError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [object, setObject]: any = useState({
    name: '',
    craft_Id: 0,
    category_Id: 0,
    color: ''
  });
  const tables = [
    'crafts',
    'categories',
    'techniques',
    'users',
  ]
  const [activeTab, setActiveTab] = useState('Craft');

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/geo_level`);
      const data = await response.json();
      setTehsils(data.filter(x => x.code.length == 9));
      for (const tableName of tables) {
        const response = await fetch(`${API_BASE_URL}/${tableName}`);
        const data = await response.json();
        switch (tableName) {
          case 'crafts':
            setCrafts(data);
            break;
          case 'categories':
            setCategories(data);
            setCategoriesAll(data);
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
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    if (isLoading) return;
    event.preventDefault();
    setError('');
    setIsLoading(true);
    // Basic validation
    try {
      const response = await fetch(`${API_BASE_URL}/${activeTab == 'Craft' ? 'crafts' :
        activeTab == 'Category' ? 'categories' :
          activeTab == 'Technique/Skills' ? 'techniques' :
            activeTab == 'User' ? 'user/register' :
              ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
      });

      if (response.ok) {
        formRef.current?.reset();
        setObject({
          name: '',
          craft_Id: 0,
          category_Id: 0,
          color: ''
        });
        setIsDialogOpen(false);// Close dialog
        fetchData();
      } else {
        setError('Saving failed');
      }
    } catch (error) {
      setError('Username or Password is incorrect!');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
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
            <Tabs defaultValue="Craft" className="w-100">
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-.5 ml-auto">
                      <Plus className="h-4 w-4" />
                      <span>{activeTab}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New {activeTab}</DialogTitle>
                    </DialogHeader>
                    {(activeTab == 'Craft' || activeTab == 'Category' || activeTab == 'Technique/Skills') && (
                      <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                          {((activeTab == 'Category' || activeTab == 'Technique/Skills')) && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="craft_Id" className="text-right">
                                Craft
                              </label>
                              <div className="col-span-3 w-full">
                                <Select
                                  value={object.craft_name}
                                  onValueChange={(value) => {
                                    setObject(prev => ({ ...prev, craft_Id: crafts.find(x => x.name == value)?.id }));
                                    setCategories(categoriesAll.filter(x => x.craft_Id == crafts.find(x => x.name == value)?.id));
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue className="text-muted" placeholder="Select craft" />
                                  </SelectTrigger>
                                  <SelectContent position="popper" className="w-full min-w-[200px]">
                                    {crafts.map((craft) => (
                                      <SelectItem key={craft.id} value={craft.name}>{craft.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          {(activeTab == 'Technique/Skills') && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="category_Id" className="text-right">
                                Category
                              </label>
                              <div className="col-span-3 w-full">
                                <Select
                                  value={object.category_name}
                                  onValueChange={(value) => {
                                    setObject(prev => ({ ...prev, category_Id: categories.find(x => x.name == value)?.id }));
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent position="popper" className="w-full min-w-[200px]" sideOffset={5}>
                                    {categories.map((category) => (
                                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right">
                              Name
                            </label>
                            <Input
                              id="name"
                              value={object.name}
                              onChange={(e) => setObject(prev => ({ ...prev, name: e.target.value }))}
                              className="col-span-3"
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="color" className="text-right">
                              Color
                            </label>
                            <Input
                              type="color"
                              id="color"
                              value={object.color || "#000000"}
                              onChange={(e) => setObject(prev => ({ ...prev, color: e.target.value }))}
                              className="col-span-3 h-10 w-full"
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="submit" className="gap-1.5"
                            disabled={isLoading || !object.name ||
                              ((activeTab == 'Category' || activeTab == 'Technique/Skills') && !object.craft_Id) ||
                              ((activeTab == 'Technique/Skills') && !object.category_Id)}
                          >
                            <Save className="h-4 w-4" />
                            <span>{isLoading ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Saving...
                              </span>
                            ) : (
                              'Save'
                            )}</span>
                          </Button>
                          <DialogClose asChild>
                            <Button type="button" variant="outline" className="gap-1.5">
                              <span>Cancel</span>
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    )}

                    {(activeTab == 'User') && (
                      <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">

                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right">
                              Username
                            </label>
                            <Input
                              id="name"
                              value={object.username}
                              onChange={(e) => {
                                setAlreadyExistError('');
                                const alreadyExist = users.find(x => x.username == e.target.value)
                                if (alreadyExist) {
                                  setAlreadyExistError('Username already exist!! Try other');
                                }
                                setObject(prev => ({ ...prev, username: e.target.value }));
                              }}
                              className="col-span-3"
                            />
                          </div>
                          {alreadyExistError && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <div></div>
                              <div className="col-span-3 text-red-500 text-sm">
                                {alreadyExistError}
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="category_Id" className="text-right">
                              Role
                            </label>
                            <div className="col-span-3 w-full">
                              <Select
                                value={object.roles}
                                onValueChange={(value) => {
                                  setObject(prev => ({ ...prev, roles: value }));
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="w-full min-w-[200px]" sideOffset={5}>
                                  <SelectItem value="Admin">Administrator</SelectItem>
                                  <SelectItem value="Surveyer">Surveyer</SelectItem>
                                  <SelectItem value="Reporting">Reporting</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {object.roles == 'Surveyer' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="geoLevel_Code" className="text-right">
                                Tehsil
                              </label>
                              <div className="col-span-3 w-full">
                                <Select
                                  value={object.geoLevel_Code}
                                  onValueChange={(value) => {
                                    setObject(prev => ({ ...prev, geoLevel_Code: value }));
                                  }}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Tehsil" />
                                  </SelectTrigger>
                                  <SelectContent position="popper" className="w-full min-w-[200px]" sideOffset={5}>
                                    {tehsils.map((tehsil) => (
                                      <SelectItem key={tehsil.code} value={tehsil.code}>{tehsil.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>

                        <DialogFooter>
                          <Button type="submit" className="gap-1.5"
                            disabled={isLoading || alreadyExistError == 'Username already exist!! Try other' || !object.username || !object.roles || (object.role == 'User' && !object.geoLevel_Code)}
                          >
                            <Save className="h-4 w-4" />
                            <span>{isLoading ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Registering...
                              </span>
                            ) : (
                              'Register'
                            )}</span>
                          </Button>
                          <DialogClose asChild>
                            <Button type="button" variant="outline" className="gap-1.5">
                              <span>Cancel</span>
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    )}
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
                              <TableHead>Number of Categories</TableHead>
                              <TableHead>Number of Techniques/Skills</TableHead>
                              <TableHead>Number of Artisans</TableHead>
                              {/* <TableHead className="w-12"></TableHead> */}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {crafts.map((craft) => (
                              <TableRow key={craft.id} className="cursor-pointer">
                                <TableCell><Badge className="py-1 px-4" style={{ backgroundColor: craft.color, color: 'black' }}>{craft.name}</Badge></TableCell>
                                <TableCell>{craft.numberOfCategories}</TableCell>
                                <TableCell>{craft.numberOfTechniques}</TableCell>
                                <TableCell>{craft.numberOfArtisans}</TableCell>
                                {/* <TableCell>
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
                                </TableCell> */}
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
                              <TableHead>Number of Techniques/Skills</TableHead>
                              <TableHead>Number of Artisans</TableHead>
                              {/* <TableHead className="w-12"></TableHead> */}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categoriesAll.map((category) => (
                              <TableRow key={category.id} className="cursor-pointer">
                                <TableCell><Badge className="py-1 px-4" style={{ backgroundColor: category.color, color: 'black' }}>{category.name}</Badge></TableCell>
                                <TableCell><Badge className="py-1 px-4" style={{ backgroundColor: category.craft_color, color: 'black' }}>{category.craft_name}</Badge></TableCell>
                                <TableCell>{category.numberOfTechniques}</TableCell>
                                <TableCell>{category.numberOfArtisans}</TableCell>
                                {/* <TableCell>
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
                                </TableCell> */}
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
                              <TableHead>Number of Artisans</TableHead>
                              {/*  <TableHead className="w-12"></TableHead> */}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {techniqueSkills.map((skill) => (
                              <TableRow key={skill.id} className="cursor-pointer">
                                <TableCell><Badge className="py-1 px-4" style={{ backgroundColor: skill.color, color: 'black' }}>{skill.name}</Badge></TableCell>
                                <TableCell><Badge className="py-1 px-4" style={{ backgroundColor: skill.category_color, color: 'black' }}>{skill.category_name}</Badge></TableCell>
                                <TableCell><Badge className="py-1 px-4" style={{ backgroundColor: skill.craft_color, color: 'black' }}>{skill.craft_name}</Badge></TableCell>
                                <TableCell className="text-md">{skill.numberOfArtisans}</TableCell>
                                {/* <TableCell>
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
                                </TableCell> */}
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
                              <TableHead>Role</TableHead>
                              <TableHead>Region</TableHead>
                              <TableHead>Number of Artisans</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow key={user.id} className="cursor-pointer" style={{ color: user.color }}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.roles}</TableCell>
                                <TableCell>{user.region ? ('Tehsil: ' + user.region) : 'Punjab'}</TableCell>
                                <TableCell>{user.numberOfArtisans}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.hashynoty)}><Lock className="h-4 w-4 me-1" /> {user.hashynoty}</DropdownMenuItem>
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
        </Layout >
      </motion.div >
    </>
  );
};

export default Manage;

export { Manage };
