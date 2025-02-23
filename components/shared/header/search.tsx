import {getAllCategories} from "@/lib/actions/product.actions";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SearchIcon} from "lucide-react";

const Search = async () => {
    const categories = await getAllCategories();

    return (
        <form
            action='/search' method='GET'>
            <div className='flex w-full max-w-sm items-center space-x-2'>
                <Select name='category'>
                    <SelectTrigger className='w-[100px]'>
                        <SelectValue placeholder='Todos' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key='All' value='all'>
                            Todos
                        </SelectItem>
                        {categories.map(x => (
                            <SelectItem key={x.category} value={x.category}>
                                {x.category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    name='q'
                    type='text'
                    placeholder='Pesquisando...'
                    className='md:w-[100px] lg:w-[300px]'
                 />
                <Button>
                    <SearchIcon />
                </Button>
            </div>
        </form>
    );
};

export default Search;