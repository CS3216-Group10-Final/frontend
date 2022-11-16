import {
  handleApiRequestError,
  showApiRequestErrorNotification,
} from "@api/error_handling";
import { User } from "@api/types";
import { getListOfUsersApi } from "@api/users_api";
import { Avatar, Group, Loader, Select, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface ItemProps {
  user: User;
}

const UserItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ user, ...others }: ItemProps, ref) => {
    return (
      <div ref={ref} {...others}>
        <Group>
          <Avatar src={user?.profile_picture_link} size={35} />
          <Text>{user?.username}</Text>
        </Group>
      </div>
    );
  }
);
UserItem.displayName = "UserItem";

interface SearchUser {
  user: User;
  value: string;
  label: string;
}

const UserSearch = () => {
  const [data, setData] = useState<SearchUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emptySearchText, setEmptySearchText] = useState<string>(
    "Type something to start searching"
  );
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    if (debouncedSearchTerm) {
      getListOfUsersApi({ page: 1, query: debouncedSearchTerm })
        .then((users) => {
          if (users.length === 0) {
            setEmptySearchText("Could not find any users");
          } else {
            const searchUsers: SearchUser[] = users.map((user) => ({
              user: user,
              value: user.username,
              label: user.username,
            }));
            setData(searchUsers);
          }
        })
        .catch((error) => {
          showApiRequestErrorNotification(handleApiRequestError(error));
          setData([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setEmptySearchText("Type something to start searching");
      setData([]);
      setIsLoading(false);
    }
  }, [debouncedSearchTerm]);

  const onChange = (value: string) => {
    router.push(`/user/${value}`);
  };

  return (
    <Select
      placeholder="Search users"
      searchable
      onSearchChange={setSearchTerm}
      onDropdownClose={() =>
        setEmptySearchText("Type something to start searching")
      }
      onChange={onChange}
      searchValue={searchTerm}
      itemComponent={UserItem}
      nothingFound={emptySearchText}
      rightSection={!isLoading ? <AiOutlineSearch /> : <Loader size={15} />}
      data={data}
    />
  );
};

export default UserSearch;
