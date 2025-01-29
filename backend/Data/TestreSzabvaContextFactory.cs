using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TestreSzabva.Data
{
    public class TestreSzabvaContextFactory : IDesignTimeDbContextFactory<TestreSzabvaContext>
    {
        public TestreSzabvaContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<TestreSzabvaContext>();
            optionsBuilder.UseSqlite(config.GetConnectionString("DefaultConnection"));

            return new TestreSzabvaContext(optionsBuilder.Options);
        }
    }
}
