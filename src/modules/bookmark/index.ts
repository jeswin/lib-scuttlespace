export { default as setup } from "./setup";

/*
  Supported commands
  
  Bookmarks
  ---------
  # Bookmark a link with a description
  bookmark https://en.wikipedia.org/wiki/Mahatma_Gandhi 

  # Bookmark a link with a description
  bookmark https://en.wikipedia.org/wiki/Mahatma_Gandhi Article on Gandhi

  # Create a bookmark directory
  bookmark dir Read Later 

  # Add a bookmark in a directory
  bookmark https://en.wikipedia.org/wiki/Mahatma_Gandhi in Read Later
  
  # Add a bookmark in a directory with a description
  bookmark https://en.wikipedia.org/wiki/Mahatma_Gandhi in Read Later. Article on Gandhi

  # Reorder directories
  bookmark organize Read Later. Wiki Links. Deep Learning. Pottery.

  # Items to show in a directory
  bookmark dir Read Later. show 10

  # Sort order in a directory, latest first
  bookmark dir Read Later. latest first

  # Sort order in a directory, oldest first
  bookmark dir Read Later. latest last

  # Disable a directory
  bookmark disable dir Read Later

  # Enable a directory
  bookmark enable dir Read Later

  # Remove a directory. Permanently Delete.
  # Only disabled directories can be removed. 
  bookmark remove dir Read Later
*/