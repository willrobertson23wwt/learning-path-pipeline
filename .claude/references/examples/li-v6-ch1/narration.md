
Every IPv4 address is thirty two bits. That's it. The four numbers separated by dots are just a friendly way of writing thirty two ones and zeros. And every address splits into two parts. The front part names the network, and the back part names the host on that network.

The prefix tells you where that split is. When an address ends in slash twenty four, that's CIDR notation, and it means the first twenty four bits are the network part, which leaves eight bits for hosts. Take one ninety two dot one sixty eight dot ten dot forty two, slash twenty four. The network is everything through the ten. The forty two is the host.

Here's the part people miss. The same address with a different prefix is on a different network. Change that slash twenty four to slash sixteen and the split moves left. Now only the first two numbers name the network, and the last two together name the host. Nothing about the address changed, but the machine's idea of who its neighbors are just changed completely. An address without its prefix is only half the story.

One more thing you'll see everywhere. Certain ranges are reserved as private address space. Anything starting with ten. The block from one seventy two dot sixteen through one seventy two dot thirty one. And everything starting with one ninety two dot one sixty eight. These never route on the public internet. They're where your lab, your office, and your home network live, and it's why the examples in this module look the way they do.

