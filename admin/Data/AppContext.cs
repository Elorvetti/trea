using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace admin.Data
{
    public class AppContext: DbContext
    {
        public AppContext(DbContextOptions<AppContext> o ) : base(o) {}
        public virtual DbSet<Administrator> Admins { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){
            optionsBuilder
                .ConfigureWarnings(warnings => 
                    warnings.Throw(RelationalEventId.QueryClientEvaluationWarning));
        }

        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<Administrator>(entity => {

                entity.HasKey(e => e.id);
                entity.Property(e => e.user);
                entity.Property(e => e.password); 
            });
        }

    }
}